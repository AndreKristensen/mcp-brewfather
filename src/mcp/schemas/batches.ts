import { z } from "zod";

const BatchStatusEnum = z.enum([
  "Planning",
  "Brewing",
  "Fermenting",
  "Conditioning",
  "Completed",
  "Archived",
]);

const OrderDirection = z.enum(["asc", "desc"]);

export const ListBatchesSchema = z.object({
  status: BatchStatusEnum.optional().describe(
    "Filter by batch status: Planning, Brewing, Fermenting, Conditioning, Completed, or Archived. Omit to get all statuses."
  ),
  include: z.string().optional().describe(
    "Comma-separated list of extra fields to include, e.g. 'recipe' to get recipe details embedded in each batch."
  ),
  complete: z.boolean().optional().describe(
    "Set to true to return the full batch document including all fields. Default is a summary."
  ),
  limit: z.number().int().min(1).max(50).optional().describe(
    "Number of batches to return (1–50, default 10)."
  ),
  start_after: z.string().optional().describe(
    "Cursor-based pagination: pass the _id of the last returned batch to get the next page."
  ),
  order_by: z.string().optional().describe(
    "Field to sort by, e.g. 'brewDate', 'batchNo', 'name'."
  ),
  order_by_direction: OrderDirection.optional().describe(
    "Sort direction: 'asc' or 'desc'."
  ),
});

export const GetBatchSchema = z.object({
  id: z.string().describe("Batch document ID (the _id field)."),
});

export const UpdateBatchSchema = z.object({
  id: z.string().describe("Batch document ID to update."),
  status: BatchStatusEnum.optional().describe("New status for the batch."),
  measuredMashPh: z.number().optional().describe("Measured mash pH value."),
  measuredBoilSize: z.number().optional().describe("Measured pre-boil volume in liters."),
  measuredFirstWortGravity: z.number().optional().describe("Measured first wort gravity (SG)."),
  measuredPreBoilGravity: z.number().optional().describe("Measured pre-boil gravity (SG)."),
  measuredPostBoilGravity: z.number().optional().describe("Measured post-boil gravity (SG)."),
  measuredKettleSize: z.number().optional().describe("Measured kettle volume in liters."),
  measuredOg: z.number().optional().describe("Measured original gravity (SG)."),
  measuredFermenterTopUp: z.number().optional().describe("Fermenter top-up water added in liters."),
  measuredBatchSize: z.number().optional().describe("Measured final batch size in liters."),
  measuredFg: z.number().optional().describe("Measured final gravity (SG)."),
  measuredBottlingSize: z.number().optional().describe("Measured volume at bottling in liters."),
  carbonationTemp: z.number().optional().describe("Carbonation temperature in Celsius."),
});

export const GetReadingsSchema = z.object({
  id: z.string().describe("Batch document ID."),
  limit: z.number().int().min(1).max(50).optional().describe(
    "Number of readings to return (1–50, default 50)."
  ),
  start_after: z.string().optional().describe(
    "Cursor-based pagination: pass the _id of the last returned reading to get the next page."
  ),
});

export const GetLastReadingSchema = z.object({
  id: z.string().describe("Batch document ID."),
});

export const GetBrewTrackerSchema = z.object({
  id: z.string().describe("Batch document ID."),
});
