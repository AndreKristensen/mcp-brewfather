import { z } from "zod";

const OrderDirection = z.enum(["asc", "desc"]);

export const ListRecipesSchema = z.object({
  include: z.string().optional().describe(
    "Comma-separated extra fields to include in each recipe."
  ),
  complete: z.boolean().optional().describe(
    "Set to true to return full recipe documents. Default is summary."
  ),
  limit: z.number().int().min(1).max(50).optional().describe(
    "Number of recipes to return (1–50, default 10)."
  ),
  start_after: z.string().optional().describe(
    "Cursor-based pagination: pass the _id of the last returned recipe to get the next page."
  ),
  order_by: z.string().optional().describe(
    "Field to sort by, e.g. 'name', 'og', 'abv'."
  ),
  order_by_direction: OrderDirection.optional().describe(
    "Sort direction: 'asc' or 'desc'."
  ),
});

export const GetRecipeSchema = z.object({
  id: z.string().describe("Recipe document ID (the _id field)."),
  include: z.string().optional().describe(
    "Comma-separated extra fields to include."
  ),
});
