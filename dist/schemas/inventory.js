"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInventoryItemSchema = exports.GetInventoryItemSchema = exports.ListInventorySchema = void 0;
const zod_1 = require("zod");
const InventoryTypeEnum = zod_1.z.enum(["fermentables", "hops", "miscs", "yeasts"]);
const OrderDirection = zod_1.z.enum(["asc", "desc"]);
exports.ListInventorySchema = zod_1.z.object({
    type: InventoryTypeEnum.describe("Type of inventory to list: 'fermentables', 'hops', 'miscs', or 'yeasts'."),
    inventory_exists: zod_1.z.boolean().optional().describe("Set to true to only return items that have stock (inventory > 0). Set to false to return items with no stock."),
    inventory_negative: zod_1.z.boolean().optional().describe("Set to true to only return items with negative inventory."),
    include: zod_1.z.string().optional().describe("Comma-separated extra fields to include."),
    complete: zod_1.z.boolean().optional().describe("Set to true to return full item documents. Default is summary."),
    limit: zod_1.z.number().int().min(1).max(50).optional().describe("Number of items to return (1–50, default 10)."),
    start_after: zod_1.z.string().optional().describe("Cursor-based pagination: pass the _id of the last returned item to get the next page."),
    order_by: zod_1.z.string().optional().describe("Field to sort by, e.g. 'name', 'inventory'."),
    order_by_direction: OrderDirection.optional().describe("Sort direction: 'asc' or 'desc'."),
});
exports.GetInventoryItemSchema = zod_1.z.object({
    type: InventoryTypeEnum.describe("Type of inventory item: 'fermentables', 'hops', 'miscs', or 'yeasts'."),
    id: zod_1.z.string().describe("Inventory item document ID (the _id field)."),
});
exports.UpdateInventoryItemSchema = zod_1.z.object({
    type: InventoryTypeEnum.describe("Type of inventory item to update: 'fermentables', 'hops', 'miscs', or 'yeasts'."),
    id: zod_1.z.string().describe("Inventory item document ID to update."),
    inventory: zod_1.z.number().optional().describe("Set the inventory amount to this exact value (in kg for fermentables/hops, in the item's unit for others)."),
    inventory_adjust: zod_1.z.number().optional().describe("Adjust inventory by this amount (positive to add, negative to subtract). Takes precedence over 'inventory' if both are provided."),
});
