import {
  BatchSummary,
  BatchDetail,
  BatchStatus,
  RecipeSummary,
  RecipeDetail,
  Fermentable,
  Hop,
  Misc,
  Yeast,
  SensorReading,
  BrewTrackerState,
  InventoryType,
} from "./types";

export type InventoryItem = Fermentable | Hop | Misc | Yeast;

export interface BatchListParams {
  include?: string;
  complete?: boolean;
  status?: BatchStatus;
  limit?: number;
  start_after?: string;
  order_by?: string;
  order_by_direction?: "asc" | "desc";
}

export interface RecipeListParams {
  include?: string;
  complete?: boolean;
  limit?: number;
  start_after?: string;
  order_by?: string;
  order_by_direction?: "asc" | "desc";
}

export interface InventoryListParams {
  include?: string;
  complete?: boolean;
  inventory_exists?: boolean;
  inventory_negative?: boolean;
  limit?: number;
  start_after?: string;
  order_by?: string;
  order_by_direction?: "asc" | "desc";
}

export interface ReadingListParams {
  limit?: number;
  start_after?: string;
}

export interface BatchUpdateBody {
  status?: BatchStatus;
  measuredMashPh?: number;
  measuredBoilSize?: number;
  measuredFirstWortGravity?: number;
  measuredPreBoilGravity?: number;
  measuredPostBoilGravity?: number;
  measuredKettleSize?: number;
  measuredOg?: number;
  measuredFermenterTopUp?: number;
  measuredBatchSize?: number;
  measuredFg?: number;
  measuredBottlingSize?: number;
  carbonationTemp?: number;
}

export interface InventoryUpdateBody {
  inventory?: number;
  inventory_adjust?: number;
}

export class BrewfatherClient {
  private readonly baseUrl = "https://api.brewfather.app/v2";
  private readonly authHeader: string;

  constructor(userId: string, apiKey: string) {
    this.authHeader =
      "Basic " + Buffer.from(`${userId}:${apiKey}`).toString("base64");
  }

  private buildQuery(params: Record<string, unknown>): string {
    const entries = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null
    );
    if (entries.length === 0) return "";
    const qs = entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
    return `?${qs}`;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new ApiError(res.status, res.statusText, body);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }

  // ── Batches ─────────────────────────────────────────────────────────────────

  async listBatches(params: BatchListParams = {}): Promise<BatchSummary[]> {
    const qs = this.buildQuery(params as Record<string, unknown>);
    return this.request<BatchSummary[]>(`/batches${qs}`);
  }

  async getBatch(
    id: string,
    params: { include?: string } = {}
  ): Promise<BatchDetail> {
    const qs = this.buildQuery(params as Record<string, unknown>);
    return this.request<BatchDetail>(`/batches/${id}${qs}`);
  }

  async updateBatch(id: string, body: BatchUpdateBody): Promise<BatchDetail> {
    return this.request<BatchDetail>(`/batches/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async getLastReading(id: string): Promise<SensorReading> {
    return this.request<SensorReading>(`/batches/${id}/readings/last`);
  }

  async getReadings(
    id: string,
    params: ReadingListParams = {}
  ): Promise<SensorReading[]> {
    const qs = this.buildQuery(params as Record<string, unknown>);
    return this.request<SensorReading[]>(`/batches/${id}/readings${qs}`);
  }

  async getBrewTracker(id: string): Promise<BrewTrackerState> {
    return this.request<BrewTrackerState>(`/batches/${id}/brewtracker`);
  }

  // ── Recipes ──────────────────────────────────────────────────────────────────

  async listRecipes(params: RecipeListParams = {}): Promise<RecipeSummary[]> {
    const qs = this.buildQuery(params as Record<string, unknown>);
    return this.request<RecipeSummary[]>(`/recipes${qs}`);
  }

  async getRecipe(
    id: string,
    params: { include?: string } = {}
  ): Promise<RecipeDetail> {
    const qs = this.buildQuery(params as Record<string, unknown>);
    return this.request<RecipeDetail>(`/recipes/${id}${qs}`);
  }

  // ── Inventory ────────────────────────────────────────────────────────────────

  async listInventory(
    type: InventoryType,
    params: InventoryListParams = {}
  ): Promise<InventoryItem[]> {
    const qs = this.buildQuery(params as Record<string, unknown>);
    return this.request<InventoryItem[]>(`/inventory/${type}${qs}`);
  }

  async getInventoryItem(
    type: InventoryType,
    id: string
  ): Promise<InventoryItem> {
    return this.request<InventoryItem>(`/inventory/${type}/${id}`);
  }

  async updateInventoryItem(
    type: InventoryType,
    id: string,
    body: InventoryUpdateBody
  ): Promise<InventoryItem> {
    return this.request<InventoryItem>(`/inventory/${type}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "ApiError";
  }

  toUserMessage(): string {
    switch (this.status) {
      case 401:
        return "Authentication failed (401). Check your BREWFATHER_USER_ID and BREWFATHER_API_KEY.";
      case 403:
        return "Access forbidden (403). The API key may lack the required scope for this operation.";
      case 404:
        return "Not found (404). The requested resource does not exist.";
      case 429:
        return "Rate limit exceeded (429). Brewfather allows 500 requests/hour. Please wait before retrying.";
      case 500:
      case 502:
      case 503:
        return `Brewfather server error (${this.status}). Please try again later.`;
      default:
        return `API error ${this.status}: ${this.statusText}. ${this.body}`.trim();
    }
  }
}
