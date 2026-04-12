"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRecipeSchema = exports.ListRecipesSchema = void 0;
const zod_1 = require("zod");
const OrderDirection = zod_1.z.enum(["asc", "desc"]);
exports.ListRecipesSchema = zod_1.z.object({
    include: zod_1.z.string().optional().describe("Comma-separated extra fields to include in each recipe."),
    complete: zod_1.z.boolean().optional().describe("Set to true to return full recipe documents. Default is summary."),
    limit: zod_1.z.number().int().min(1).max(50).optional().describe("Number of recipes to return (1–50, default 10)."),
    start_after: zod_1.z.string().optional().describe("Cursor-based pagination: pass the _id of the last returned recipe to get the next page."),
    order_by: zod_1.z.string().optional().describe("Field to sort by, e.g. 'name', 'og', 'abv'."),
    order_by_direction: OrderDirection.optional().describe("Sort direction: 'asc' or 'desc'."),
});
exports.GetRecipeSchema = zod_1.z.object({
    id: zod_1.z.string().describe("Recipe document ID (the _id field)."),
    include: zod_1.z.string().optional().describe("Comma-separated extra fields to include."),
});
