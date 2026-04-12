"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatInventoryItem = formatInventoryItem;
exports.formatInventoryList = formatInventoryList;
exports.formatInventoryUpdateConfirmation = formatInventoryUpdateConfirmation;
const shared_1 = require("./shared");
// ── Fermentables ──────────────────────────────────────────────────────────────
function formatFermentableItem(f, index) {
    const prefix = index != null ? `[${index + 1}] ` : "";
    const supplier = f.supplier ? ` (${f.supplier})` : "";
    const origin = f.origin ? `, ${f.origin}` : "";
    const color = f.color != null ? ` — ${Math.round(f.color)} SRM` : "";
    const potential = f.potential != null ? ` — Potential: ${f.potential.toFixed(3)} SG` : "";
    const dp = f.diastaticPower != null ? ` — DP: ${f.diastaticPower} Lintner` : "";
    const stock = formatStockFermentable(f);
    const cost = f.costPerAmount != null ? ` — Cost: ${f.costPerAmount}/kg` : "";
    const notFerm = f.notFermentable ? " — [Not fermentable]" : "";
    return `${prefix}${f.name}${supplier}${origin} — ${f.type}${color}${potential}${dp}${notFerm} | Stock: ${stock}${cost}`;
}
function formatStockFermentable(f) {
    if (f.inventory == null)
        return "Unknown";
    if (f.inventory < 0)
        return `${(0, shared_1.formatWeight)(f.inventory)} (negative — check records)`;
    if (f.inventory === 0)
        return "Out of stock";
    return (0, shared_1.formatWeight)(f.inventory);
}
// ── Hops ──────────────────────────────────────────────────────────────────────
function formatHopAroma(h) {
    if (!h.aroma)
        return "";
    const traits = [
        h.aroma.citrus ? "Citrus" : null,
        h.aroma.tropical ? "Tropical" : null,
        h.aroma.fruity ? "Fruity" : null,
        h.aroma.floral ? "Floral" : null,
        h.aroma.herbal ? "Herbal" : null,
        h.aroma.spicy ? "Spicy" : null,
        h.aroma.resinous ? "Resinous" : null,
        h.aroma.earthy ? "Earthy" : null,
        h.aroma.woody ? "Woody" : null,
        h.aroma.stone_fruit ? "Stone Fruit" : null,
    ]
        .filter(Boolean)
        .join(", ");
    return traits ? ` — Aroma: ${traits}` : "";
}
function formatHopItem(h, index) {
    const prefix = index != null ? `[${index + 1}] ` : "";
    const origin = h.origin ? ` (${h.origin})` : "";
    const usage = h.usage ? ` — ${h.usage}` : "";
    const beta = h.beta != null ? `, Beta: ${h.beta.toFixed(1)}%` : "";
    const aroma = formatHopAroma(h);
    const year = h.year ? ` — Harvest: ${h.year}` : "";
    const stock = formatStockHop(h);
    const cost = h.costPerAmount != null ? ` — Cost: ${h.costPerAmount}/100g` : "";
    return `${prefix}${h.name}${origin} — Alpha: ${h.alpha.toFixed(1)}%${beta}${usage}${aroma}${year} | Stock: ${stock}${cost}`;
}
function formatStockHop(h) {
    if (h.inventory == null)
        return "Unknown";
    if (h.inventory < 0)
        return `${h.inventory.toFixed(0)} g (negative — check records)`;
    if (h.inventory === 0)
        return "Out of stock";
    return `${h.inventory.toFixed(0)} g`;
}
// ── Yeasts ────────────────────────────────────────────────────────────────────
function formatYeastItem(y, index) {
    const prefix = index != null ? `[${index + 1}] ` : "";
    const lab = y.laboratory ? `${y.laboratory} ` : "";
    const pid = y.productId ? `${y.productId} — ` : "";
    const tempRange = y.minTemp != null && y.maxTemp != null
        ? ` — Temp: ${y.minTemp}–${y.maxTemp}°C`
        : "";
    const attenRange = y.minAttenuation != null && y.maxAttenuation != null
        ? ` — Attenuation: ${y.minAttenuation}–${y.maxAttenuation}%`
        : y.attenuation
            ? ` — Attenuation: ${y.attenuation}%`
            : "";
    const floc = y.flocculation ? ` — Flocculation: ${y.flocculation}` : "";
    const maxAbv = y.maxAbv != null ? ` — Max ABV: ${y.maxAbv}%` : "";
    const stock = formatStockYeast(y);
    const cost = y.costPerAmount != null ? ` — Cost: ${y.costPerAmount}/pkg` : "";
    return `${prefix}${lab}${pid}${y.name} — ${y.form} ${y.type}${tempRange}${attenRange}${floc}${maxAbv} | Stock: ${stock}${cost}`;
}
function formatStockYeast(y) {
    if (y.inventory == null)
        return "Unknown";
    if (y.inventory < 0)
        return `${y.inventory} ${y.unit} (negative — check records)`;
    if (y.inventory === 0)
        return "Out of stock";
    return `${y.inventory} ${y.unit}`;
}
// ── Miscs ─────────────────────────────────────────────────────────────────────
function formatMiscItem(m, index) {
    const prefix = index != null ? `[${index + 1}] ` : "";
    const conc = m.concentration != null ? ` — ${m.concentration}% concentration` : "";
    const waterAdj = m.waterAdjustment ? " — [Water Adjustment]" : "";
    const stock = formatStockMisc(m);
    const cost = m.costPerAmount != null ? ` — Cost: ${m.costPerAmount}/${m.unit}` : "";
    const notes = m.notes ? ` — ${m.notes}` : "";
    return `${prefix}${m.name} — ${m.type} — Used in: ${m.use}${conc}${waterAdj}${notes} | Stock: ${stock}${cost}`;
}
function formatStockMisc(m) {
    if (m.inventory == null)
        return "Unknown";
    if (m.inventory < 0)
        return `${m.inventory} ${m.unit} (negative — check records)`;
    if (m.inventory === 0)
        return "Out of stock";
    return `${m.inventory} ${m.unit}`;
}
// ── Public API ────────────────────────────────────────────────────────────────
function formatInventoryItem(item, type, index) {
    switch (type) {
        case "fermentables":
            return formatFermentableItem(item, index);
        case "hops":
            return formatHopItem(item, index);
        case "yeasts":
            return formatYeastItem(item, index);
        case "miscs":
            return formatMiscItem(item, index);
        default:
            return JSON.stringify(item);
    }
}
function formatInventoryList(items, type) {
    if (items.length === 0)
        return `No ${type} found in inventory.`;
    const header = `Found ${items.length} ${type}:\n`;
    const lines = items.map((item, i) => formatInventoryItem(item, type, i)).join("\n");
    return header + "\n" + lines;
}
function formatInventoryUpdateConfirmation(item, type) {
    const name = item.name ?? "Item";
    return `Inventory updated for ${name}.\n\n${formatInventoryItem(item, type)}`;
}
