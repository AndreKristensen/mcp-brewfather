"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.BrewfatherClient = void 0;
class BrewfatherClient {
    constructor(userId, apiKey) {
        this.baseUrl = "https://api.brewfather.app/v2";
        this.authHeader =
            "Basic " + Buffer.from(`${userId}:${apiKey}`).toString("base64");
    }
    buildQuery(params) {
        const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
        if (entries.length === 0)
            return "";
        const qs = entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
        return `?${qs}`;
    }
    async request(path, options) {
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
            return undefined;
        }
        return res.json();
    }
    // ── Batches ─────────────────────────────────────────────────────────────────
    async listBatches(params = {}) {
        const qs = this.buildQuery(params);
        return this.request(`/batches${qs}`);
    }
    async getBatch(id, params = {}) {
        const qs = this.buildQuery(params);
        return this.request(`/batches/${id}${qs}`);
    }
    async updateBatch(id, body) {
        return this.request(`/batches/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    }
    async getLastReading(id) {
        return this.request(`/batches/${id}/readings/last`);
    }
    async getReadings(id, params = {}) {
        const qs = this.buildQuery(params);
        return this.request(`/batches/${id}/readings${qs}`);
    }
    async getBrewTracker(id) {
        return this.request(`/batches/${id}/brewtracker`);
    }
    // ── Recipes ──────────────────────────────────────────────────────────────────
    async listRecipes(params = {}) {
        const qs = this.buildQuery(params);
        return this.request(`/recipes${qs}`);
    }
    async getRecipe(id, params = {}) {
        const qs = this.buildQuery(params);
        return this.request(`/recipes/${id}${qs}`);
    }
    // ── Inventory ────────────────────────────────────────────────────────────────
    async listInventory(type, params = {}) {
        const qs = this.buildQuery(params);
        return this.request(`/inventory/${type}${qs}`);
    }
    async getInventoryItem(type, id) {
        return this.request(`/inventory/${type}/${id}`);
    }
    async updateInventoryItem(type, id, body) {
        return this.request(`/inventory/${type}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    }
}
exports.BrewfatherClient = BrewfatherClient;
class ApiError extends Error {
    constructor(status, statusText, body) {
        super(`HTTP ${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.body = body;
        this.name = "ApiError";
    }
    toUserMessage() {
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
exports.ApiError = ApiError;
