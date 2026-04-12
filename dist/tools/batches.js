"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBatchTools = registerBatchTools;
const client_js_1 = require("../client.js");
const batches_js_1 = require("../schemas/batches.js");
const batch_js_1 = require("../transforms/batch.js");
function errorText(err) {
    if (err instanceof client_js_1.ApiError)
        return err.toUserMessage();
    if (err instanceof Error)
        return `Error: ${err.message}`;
    return "An unexpected error occurred.";
}
function registerBatchTools(server, client) {
    server.registerTool("brewfather_list_batches", {
        title: "List Brewfather Batches",
        description: "List batches from Brewfather. Optionally filter by status (Planning, Brewing, Fermenting, Conditioning, Completed, Archived). Returns batch names, brew dates, gravity readings, and fermentation status. Use 'include=recipe' to get recipe details embedded. Supports pagination via start_after.",
        inputSchema: batches_js_1.ListBatchesSchema,
    }, async (args) => {
        try {
            const batches = await client.listBatches(args);
            return { content: [{ type: "text", text: (0, batch_js_1.formatBatchList)(batches) }] };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_get_batch", {
        title: "Get Brewfather Batch",
        description: "Get full details for a specific batch by ID, including measured gravities, volumes, efficiency, fermentables, hops, yeasts, notes, and timeline. Use 'include=recipe' to embed the full recipe.",
        inputSchema: batches_js_1.GetBatchSchema,
    }, async (args) => {
        try {
            const batch = await client.getBatch(args.id, { include: args.include });
            return { content: [{ type: "text", text: (0, batch_js_1.formatBatchDetail)(batch) }] };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_update_batch", {
        title: "Update Brewfather Batch",
        description: "Update measured values or status for a batch. You can update status (e.g. move from Brewing to Fermenting) and/or record measured values like OG, FG, volumes, pH, and carbonation temperature. Returns the updated batch.",
        inputSchema: batches_js_1.UpdateBatchSchema,
    }, async (args) => {
        try {
            const { id, ...updates } = args;
            const updated = await client.updateBatch(id, updates);
            return {
                content: [{ type: "text", text: (0, batch_js_1.formatUpdateConfirmation)(updated) }],
            };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_get_last_reading", {
        title: "Get Last Sensor Reading",
        description: "Get the most recent sensor reading (gravity, temperature, pH, pressure) for a batch. Readings come from connected devices like iSpindel, Tilt, or manual entries.",
        inputSchema: batches_js_1.GetLastReadingSchema,
    }, async (args) => {
        try {
            const reading = await client.getLastReading(args.id);
            if (!reading || Object.keys(reading).length === 0) {
                return {
                    content: [{ type: "text", text: "No readings recorded for this batch yet." }],
                };
            }
            return {
                content: [{ type: "text", text: `Last reading:\n${(0, batch_js_1.formatReading)(reading)}` }],
            };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_get_readings", {
        title: "Get All Batch Readings",
        description: "Get all sensor readings for a batch in chronological order. Readings include gravity, temperature, pH, and pressure from connected devices or manual entries. Supports pagination.",
        inputSchema: batches_js_1.GetReadingsSchema,
    }, async (args) => {
        try {
            const { id, ...params } = args;
            const readings = await client.getReadings(id, params);
            return {
                content: [{ type: "text", text: (0, batch_js_1.formatReadingsList)(readings) }],
            };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_get_brew_tracker", {
        title: "Get Brew Tracker State",
        description: "Get the current state of the Brew Tracker for a batch, including stages, current step, and completion status. Returns an inactive message if the tracker is not enabled.",
        inputSchema: batches_js_1.GetBrewTrackerSchema,
    }, async (args) => {
        try {
            const tracker = await client.getBrewTracker(args.id);
            return {
                content: [{ type: "text", text: (0, batch_js_1.formatBrewTracker)(tracker) }],
            };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
}
