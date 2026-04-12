"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInventoryTools = registerInventoryTools;
const client_1 = require("../client");
const inventory_1 = require("../schemas/inventory");
const inventory_2 = require("../transforms/inventory");
function errorText(err) {
    if (err instanceof client_1.ApiError)
        return err.toUserMessage();
    if (err instanceof Error)
        return `Error: ${err.message}`;
    return "An unexpected error occurred.";
}
function registerInventoryTools(server, client) {
    server.registerTool("brewfather_list_inventory", {
        title: "List Brewfather Inventory",
        description: "List inventory items from Brewfather. Use the 'type' parameter to select fermentables (grains/sugars/adjuncts), hops, miscs (spices/finings/water agents), or yeasts. Optionally filter to only items in stock (inventory_exists=true) or with negative inventory. Supports pagination.",
        inputSchema: inventory_1.ListInventorySchema,
    }, async (args) => {
        try {
            const { type, ...params } = args;
            const items = await client.listInventory(type, params);
            return {
                content: [{ type: "text", text: (0, inventory_2.formatInventoryList)(items, type) }],
            };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_get_inventory_item", {
        title: "Get Brewfather Inventory Item",
        description: "Get full details for a specific inventory item by type and ID. Returns all properties including stock amount, cost, origin, and brewing characteristics.",
        inputSchema: inventory_1.GetInventoryItemSchema,
    }, async (args) => {
        try {
            const item = await client.getInventoryItem(args.type, args.id);
            return {
                content: [
                    {
                        type: "text",
                        text: (0, inventory_2.formatInventoryItem)(item, args.type),
                    },
                ],
            };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_update_inventory_item", {
        title: "Update Brewfather Inventory",
        description: "Update the stock amount for an inventory item (fermentable, hop, misc, or yeast). Use 'inventory' to set an exact amount, or 'inventory_adjust' to add/subtract from current stock (e.g. -0.5 to deduct 500g used in a batch). inventory_adjust takes precedence if both are provided.",
        inputSchema: inventory_1.UpdateInventoryItemSchema,
    }, async (args) => {
        try {
            const { type, id, ...body } = args;
            const updated = await client.updateInventoryItem(type, id, body);
            return {
                content: [
                    {
                        type: "text",
                        text: (0, inventory_2.formatInventoryUpdateConfirmation)(updated, type),
                    },
                ],
            };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
}
