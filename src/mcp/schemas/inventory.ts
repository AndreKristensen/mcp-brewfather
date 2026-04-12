import { z } from "zod";

const InventoryTypeEnum = z.enum(["fermentables", "hops", "miscs", "yeasts"]);
const OrderDirection = z.enum(["asc", "desc"]);

export const ListInventorySchema = z.object({
  type: InventoryTypeEnum.describe(
    "Type of inventory to list: 'fermentables', 'hops', 'miscs', or 'yeasts'."
  ),
  inventory_exists: z.boolean().optional().describe(
    "Set to true to only return items that have stock (inventory > 0). Set to false to return items with no stock."
  ),
  inventory_negative: z.boolean().optional().describe(
    "Set to true to only return items with negative inventory."
  ),
  include: z.string().optional().describe(
    "Comma-separated extra fields to include."
  ),
  complete: z.boolean().optional().describe(
    "Set to true to return full item documents. Default is summary."
  ),
  limit: z.number().int().min(1).max(50).optional().describe(
    "Number of items to return (1–50, default 10)."
  ),
  start_after: z.string().optional().describe(
    "Cursor-based pagination: pass the _id of the last returned item to get the next page."
  ),
  order_by: z.string().optional().describe(
    "Field to sort by, e.g. 'name', 'inventory'."
  ),
  order_by_direction: OrderDirection.optional().describe(
    "Sort direction: 'asc' or 'desc'."
  ),
});

export const GetInventoryItemSchema = z.object({
  type: InventoryTypeEnum.describe(
    "Type of inventory item: 'fermentables', 'hops', 'miscs', or 'yeasts'."
  ),
  id: z.string().describe("Inventory item document ID (the _id field)."),
});

export const UpdateInventoryItemSchema = z.object({
  type: InventoryTypeEnum.describe(
    "Type of inventory item to update: 'fermentables', 'hops', 'miscs', or 'yeasts'."
  ),
  id: z.string().describe("Inventory item document ID to update."),
  inventory: z.number().optional().describe(
    "Set the inventory amount to this exact value (in kg for fermentables/hops, in the item's unit for others)."
  ),
  inventory_adjust: z.number().optional().describe(
    "Adjust inventory by this amount (positive to add, negative to subtract). Takes precedence over 'inventory' if both are provided."
  ),
});
