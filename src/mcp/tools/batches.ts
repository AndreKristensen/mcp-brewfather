import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrewfatherClient, ApiError } from "../client";
import {
  ListBatchesSchema,
  GetBatchSchema,
  UpdateBatchSchema,
  GetReadingsSchema,
  GetLastReadingSchema,
  GetBrewTrackerSchema,
} from "../schemas/batches";
import {
  formatBatchList,
  formatBatchDetail,
  formatReadingsList,
  formatReading,
  formatBrewTracker,
  formatUpdateConfirmation,
} from "../transforms/batch";

function errorText(err: unknown): string {
  if (err instanceof ApiError) return err.toUserMessage();
  if (err instanceof Error) return `Error: ${err.message}`;
  return "An unexpected error occurred.";
}

export function registerBatchTools(server: McpServer, client: BrewfatherClient): void {
  server.registerTool(
    "brewfather_list_batches",
    {
      title: "List Brewfather Batches",
      description:
        "List batches from Brewfather. Optionally filter by status (Planning, Brewing, Fermenting, Conditioning, Completed, Archived). Returns batch names, brew dates, gravity readings, and fermentation status. Use 'include=recipe' to get recipe details embedded. Supports pagination via start_after.",
      inputSchema: ListBatchesSchema,
    },
    async (args) => {
      try {
        const batches = await client.listBatches(args);
        return { content: [{ type: "text", text: formatBatchList(batches) }] };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );

  server.registerTool(
    "brewfather_get_batch",
    {
      title: "Get Brewfather Batch",
      description:
        "Get full details for a specific batch by ID, including measured gravities, volumes, efficiency, fermentables, hops, yeasts, notes, and timeline. Use 'include=recipe' to embed the full recipe.",
      inputSchema: GetBatchSchema,
    },
    async (args) => {
      try {
        // Always include recipe so hop schedule and fermentation profile are available
        // even when batchHops/batchYeasts haven't been confirmed yet.
        const include = args.include
          ? args.include.includes("recipe")
            ? args.include
            : `${args.include},recipe`
          : "recipe";
        let batch = await client.getBatch(args.id, { include });

        // Brewfather's ?include=recipe embeds only a recipe summary in the batch
        // response — ingredient arrays (hops, fermentables, yeasts, miscs) and
        // the fermentation profile are typically absent from the embedded object.
        // When batch-level ingredients haven't been confirmed yet (batchHops is
        // empty), fall back to a full recipe fetch so the dry hop schedule and
        // fermentation profile are always available.
        const batchHasIngredients =
          (batch.batchHops?.length ?? 0) > 0 ||
          (batch.batchFermentables?.length ?? 0) > 0;
        const embeddedRecipeMissingIngredients =
          (batch.recipe?.hops?.length ?? 0) === 0 &&
          (batch.recipe?.fermentables?.length ?? 0) === 0;

        if (!batchHasIngredients && embeddedRecipeMissingIngredients && batch.recipe?._id) {
          try {
            const fullRecipe = await client.getRecipe(batch.recipe._id);
            batch = { ...batch, recipe: fullRecipe };
          } catch {
            // Best-effort — format with whatever we already have
          }
        }

        return { content: [{ type: "text", text: formatBatchDetail(batch) }] };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );

  server.registerTool(
    "brewfather_update_batch",
    {
      title: "Update Brewfather Batch",
      description:
        "Update measured values or status for a batch. You can update status (e.g. move from Brewing to Fermenting) and/or record measured values like OG, FG, volumes, pH, and carbonation temperature. Returns the updated batch.",
      inputSchema: UpdateBatchSchema,
    },
    async (args) => {
      try {
        const { id, ...updates } = args;
        const updated = await client.updateBatch(id, updates);
        return {
          content: [{ type: "text", text: formatUpdateConfirmation(updated) }],
        };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );

  server.registerTool(
    "brewfather_get_last_reading",
    {
      title: "Get Last Sensor Reading",
      description:
        "Get the most recent sensor reading (gravity, temperature, pH, pressure) for a batch. Readings come from connected devices like iSpindel, Tilt, or manual entries.",
      inputSchema: GetLastReadingSchema,
    },
    async (args) => {
      try {
        const reading = await client.getLastReading(args.id);
        if (!reading || Object.keys(reading).length === 0) {
          return {
            content: [{ type: "text", text: "No readings recorded for this batch yet." }],
          };
        }
        return {
          content: [{ type: "text", text: `Last reading:\n${formatReading(reading)}` }],
        };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );

  server.registerTool(
    "brewfather_get_readings",
    {
      title: "Get All Batch Readings",
      description:
        "Get all sensor readings for a batch in chronological order. Readings include gravity, temperature, pH, and pressure from connected devices or manual entries. Supports pagination.",
      inputSchema: GetReadingsSchema,
    },
    async (args) => {
      try {
        const { id, ...params } = args;
        const readings = await client.getReadings(id, params);
        return {
          content: [{ type: "text", text: formatReadingsList(readings) }],
        };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );

  server.registerTool(
    "brewfather_get_brew_tracker",
    {
      title: "Get Brew Tracker State",
      description:
        "Get the current state of the Brew Tracker for a batch, including stages, current step, and completion status. Returns an inactive message if the tracker is not enabled.",
      inputSchema: GetBrewTrackerSchema,
    },
    async (args) => {
      try {
        const tracker = await client.getBrewTracker(args.id);
        return {
          content: [{ type: "text", text: formatBrewTracker(tracker) }],
        };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );
}
