"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBrewTrackerSchema = exports.GetLastReadingSchema = exports.GetReadingsSchema = exports.UpdateBatchSchema = exports.GetBatchSchema = exports.ListBatchesSchema = void 0;
const zod_1 = require("zod");
const BatchStatusEnum = zod_1.z.enum([
    "Planning",
    "Brewing",
    "Fermenting",
    "Conditioning",
    "Completed",
    "Archived",
]);
const OrderDirection = zod_1.z.enum(["asc", "desc"]);
exports.ListBatchesSchema = zod_1.z.object({
    status: BatchStatusEnum.optional().describe("Filter by batch status: Planning, Brewing, Fermenting, Conditioning, Completed, or Archived. Omit to get all statuses."),
    include: zod_1.z.string().optional().describe("Comma-separated list of extra fields to include, e.g. 'recipe' to get recipe details embedded in each batch."),
    complete: zod_1.z.boolean().optional().describe("Set to true to return the full batch document including all fields. Default is a summary."),
    limit: zod_1.z.number().int().min(1).max(50).optional().describe("Number of batches to return (1–50, default 10)."),
    start_after: zod_1.z.string().optional().describe("Cursor-based pagination: pass the _id of the last returned batch to get the next page."),
    order_by: zod_1.z.string().optional().describe("Field to sort by, e.g. 'brewDate', 'batchNo', 'name'."),
    order_by_direction: OrderDirection.optional().describe("Sort direction: 'asc' or 'desc'."),
});
exports.GetBatchSchema = zod_1.z.object({
    id: zod_1.z.string().describe("Batch document ID (the _id field)."),
    include: zod_1.z.string().optional().describe("Comma-separated extra fields to include, e.g. 'recipe' to embed recipe details."),
});
exports.UpdateBatchSchema = zod_1.z.object({
    id: zod_1.z.string().describe("Batch document ID to update."),
    status: BatchStatusEnum.optional().describe("New status for the batch."),
    measuredMashPh: zod_1.z.number().optional().describe("Measured mash pH value."),
    measuredBoilSize: zod_1.z.number().optional().describe("Measured pre-boil volume in liters."),
    measuredFirstWortGravity: zod_1.z.number().optional().describe("Measured first wort gravity (SG)."),
    measuredPreBoilGravity: zod_1.z.number().optional().describe("Measured pre-boil gravity (SG)."),
    measuredPostBoilGravity: zod_1.z.number().optional().describe("Measured post-boil gravity (SG)."),
    measuredKettleSize: zod_1.z.number().optional().describe("Measured kettle volume in liters."),
    measuredOg: zod_1.z.number().optional().describe("Measured original gravity (SG)."),
    measuredFermenterTopUp: zod_1.z.number().optional().describe("Fermenter top-up water added in liters."),
    measuredBatchSize: zod_1.z.number().optional().describe("Measured final batch size in liters."),
    measuredFg: zod_1.z.number().optional().describe("Measured final gravity (SG)."),
    measuredBottlingSize: zod_1.z.number().optional().describe("Measured volume at bottling in liters."),
    carbonationTemp: zod_1.z.number().optional().describe("Carbonation temperature in Celsius."),
});
exports.GetReadingsSchema = zod_1.z.object({
    id: zod_1.z.string().describe("Batch document ID."),
    limit: zod_1.z.number().int().min(1).max(50).optional().describe("Number of readings to return (1–50, default 50)."),
    start_after: zod_1.z.string().optional().describe("Cursor-based pagination: pass the _id of the last returned reading to get the next page."),
});
exports.GetLastReadingSchema = zod_1.z.object({
    id: zod_1.z.string().describe("Batch document ID."),
});
exports.GetBrewTrackerSchema = zod_1.z.object({
    id: zod_1.z.string().describe("Batch document ID."),
});
