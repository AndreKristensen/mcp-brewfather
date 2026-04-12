import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrewfatherClient, ApiError } from "../client";
import { ListRecipesSchema, GetRecipeSchema } from "../schemas/recipes";
import { formatRecipeList, formatRecipeDetail } from "../transforms/recipe";

function errorText(err: unknown): string {
  if (err instanceof ApiError) return err.toUserMessage();
  if (err instanceof Error) return `Error: ${err.message}`;
  return "An unexpected error occurred.";
}

export function registerRecipeTools(server: McpServer, client: BrewfatherClient): void {
  server.registerTool(
    "brewfather_list_recipes",
    {
      title: "List Brewfather Recipes",
      description:
        "List recipes from Brewfather. Returns recipe names, style, batch size, estimated OG/FG/ABV/IBU, and type (All Grain, Extract, Partial Mash). Supports pagination and sorting.",
      inputSchema: ListRecipesSchema,
    },
    async (args) => {
      try {
        const recipes = await client.listRecipes(args);
        return { content: [{ type: "text", text: formatRecipeList(recipes) }] };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );

  server.registerTool(
    "brewfather_get_recipe",
    {
      title: "Get Brewfather Recipe",
      description:
        "Get full details for a specific recipe by ID, including all fermentables, hops, yeasts, miscellaneous ingredients, mash steps, fermentation profile, water profile, equipment, and brewing notes.",
      inputSchema: GetRecipeSchema,
    },
    async (args) => {
      try {
        const recipe = await client.getRecipe(args.id, { include: args.include });
        return { content: [{ type: "text", text: formatRecipeDetail(recipe) }] };
      } catch (err) {
        return { content: [{ type: "text", text: errorText(err) }] };
      }
    }
  );
}
