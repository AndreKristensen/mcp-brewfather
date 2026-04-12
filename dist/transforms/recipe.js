"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRecipeSummary = formatRecipeSummary;
exports.formatRecipeDetail = formatRecipeDetail;
exports.formatRecipeList = formatRecipeList;
const shared_js_1 = require("./shared.js");
function formatRecipeSummary(recipe, index) {
    const prefix = index != null ? `[${index + 1}] ` : "";
    const style = recipe.style?.name ? ` — ${recipe.style.name}` : "";
    const og = recipe.og ? `OG: ${(0, shared_js_1.formatGravity)(recipe.og)}` : "";
    const abv = recipe.abv ? (0, shared_js_1.formatAbv)(recipe.abv) : "";
    const ibu = recipe.ibu ? (0, shared_js_1.formatIbu)(recipe.ibu) : "";
    const stats = [og, abv, ibu].filter(Boolean).join(" | ");
    const volume = (0, shared_js_1.formatVolume)(recipe.batchSize);
    return `${prefix}"${recipe.name}"${style} — ${recipe.type} — ${volume} — ${stats}`;
}
function formatRecipeDetail(recipe) {
    const lines = [];
    // ── Overview ──────────────────────────────────────────────────────────────
    lines.push(`## Recipe: "${recipe.name}"`);
    if (recipe.author)
        lines.push(`Author: ${recipe.author}`);
    lines.push(`Type: ${recipe.type}`);
    if (recipe.style?.name) {
        const guide = recipe.style.styleGuide ? ` (${recipe.style.styleGuide})` : "";
        lines.push(`Style: ${recipe.style.name}${guide}`);
        if (recipe.styleConformity != null) {
            lines.push(`Style conformity: ${recipe.styleConformity ? "Yes" : "No"}`);
        }
    }
    if (recipe.teaser)
        lines.push(`Description: ${recipe.teaser}`);
    if (recipe.tags?.length)
        lines.push(`Tags: ${recipe.tags.map((t) => t.name).join(", ")}`);
    lines.push("");
    // ── Vitals ────────────────────────────────────────────────────────────────
    lines.push("### Vitals");
    lines.push(`Batch size: ${(0, shared_js_1.formatVolume)(recipe.batchSize)} | Boil size: ${(0, shared_js_1.formatVolume)(recipe.boilSize)}`);
    lines.push(`Boil time: ${(0, shared_js_1.formatMinutes)(recipe.boilTime)}`);
    lines.push(`Efficiency: ${(0, shared_js_1.formatPercentage)(recipe.efficiency)}`);
    lines.push(`OG: ${(0, shared_js_1.formatGravity)(recipe.og)}`);
    lines.push(`FG: ${(0, shared_js_1.formatGravity)(recipe.fg)} (estimated: ${(0, shared_js_1.formatGravity)(recipe.fgEstimated)})`);
    lines.push(`ABV: ${(0, shared_js_1.formatAbv)(recipe.abv)}`);
    lines.push(`IBU: ${(0, shared_js_1.formatIbu)(recipe.ibu)}${recipe.ibuFormula ? ` (${recipe.ibuFormula})` : ""}`);
    lines.push(`Color: ${(0, shared_js_1.formatColor)(recipe.color)}`);
    if (recipe.attenuation)
        lines.push(`Attenuation: ${(0, shared_js_1.formatPercentage)(recipe.attenuation)}`);
    if (recipe.buGuRatio)
        lines.push(`BU:GU ratio: ${recipe.buGuRatio.toFixed(2)}`);
    if (recipe.diastaticPower)
        lines.push(`Diastatic power: ${recipe.diastaticPower} Lintner`);
    lines.push("");
    // ── Carbonation ───────────────────────────────────────────────────────────
    if (recipe.carbonation != null) {
        lines.push("### Carbonation");
        lines.push(`Target: ${recipe.carbonation.toFixed(1)} vol CO₂`);
        if (recipe.carbonationTemp != null)
            lines.push(`Temperature: ${(0, shared_js_1.formatTemp)(recipe.carbonationTemp)}`);
        if (recipe.primingSugarEquiv != null)
            lines.push(`Priming sugar equiv: ${recipe.primingSugarEquiv.toFixed(1)} g/L`);
        lines.push("");
    }
    // ── Fermentables ──────────────────────────────────────────────────────────
    if (recipe.fermentables?.length > 0) {
        lines.push("### Fermentables");
        const total = recipe.fermentablesTotalAmount;
        recipe.fermentables.forEach((f) => {
            lines.push(formatFermentable(f, total));
        });
        if (total)
            lines.push(`  Total: ${(0, shared_js_1.formatWeight)(total)}`);
        lines.push("");
    }
    // ── Hops ──────────────────────────────────────────────────────────────────
    if (recipe.hops?.length > 0) {
        lines.push("### Hops");
        const total = recipe.hopsTotalAmount;
        recipe.hops.forEach((h) => lines.push(formatHop(h)));
        if (total)
            lines.push(`  Total: ${(0, shared_js_1.formatWeight)(total / 1000)}`);
        lines.push("");
    }
    // ── Yeasts ────────────────────────────────────────────────────────────────
    if (recipe.yeasts?.length > 0) {
        lines.push("### Yeast");
        recipe.yeasts.forEach((y) => lines.push(formatYeastInRecipe(y)));
        lines.push("");
    }
    // ── Miscellaneous ─────────────────────────────────────────────────────────
    if (recipe.miscs?.length > 0) {
        lines.push("### Miscellaneous");
        recipe.miscs.forEach((m) => lines.push(formatMiscInRecipe(m)));
        lines.push("");
    }
    // ── Mash ──────────────────────────────────────────────────────────────────
    const mash = recipe.mash;
    if (mash && mash.steps && mash.steps.length > 0) {
        lines.push(`### Mash: ${mash.name}`);
        mash.steps.forEach((s) => lines.push(formatMashStep(s)));
        lines.push("");
    }
    // ── Fermentation ──────────────────────────────────────────────────────────
    const fermentation = recipe.fermentation;
    if (fermentation && fermentation.steps && fermentation.steps.length > 0) {
        lines.push(`### Fermentation Profile: ${fermentation.name}`);
        fermentation.steps.forEach((s) => lines.push(formatFermentationStep(s)));
        lines.push("");
    }
    // ── Water ─────────────────────────────────────────────────────────────────
    if (recipe.water) {
        lines.push(`### Water Profile: ${recipe.water.name}`);
        const ions = [];
        if (recipe.water.calcium != null)
            ions.push(`Ca: ${recipe.water.calcium} ppm`);
        if (recipe.water.magnesium != null)
            ions.push(`Mg: ${recipe.water.magnesium} ppm`);
        if (recipe.water.sodium != null)
            ions.push(`Na: ${recipe.water.sodium} ppm`);
        if (recipe.water.chloride != null)
            ions.push(`Cl: ${recipe.water.chloride} ppm`);
        if (recipe.water.sulfate != null)
            ions.push(`SO₄: ${recipe.water.sulfate} ppm`);
        if (recipe.water.bicarbonate != null)
            ions.push(`HCO₃: ${recipe.water.bicarbonate} ppm`);
        if (recipe.water.ph != null)
            ions.push(`pH: ${recipe.water.ph.toFixed(1)}`);
        lines.push(`  ${ions.join(" | ")}`);
        lines.push("");
    }
    // ── Equipment ─────────────────────────────────────────────────────────────
    if (recipe.equipment) {
        lines.push(`### Equipment: ${recipe.equipment.name}`);
        lines.push(`  Batch: ${(0, shared_js_1.formatVolume)(recipe.equipment.batchSize)} | Boil: ${(0, shared_js_1.formatVolume)(recipe.equipment.boilSize)} | Efficiency: ${(0, shared_js_1.formatPercentage)(recipe.equipment.efficiency)}`);
        lines.push("");
    }
    // ── Notes ─────────────────────────────────────────────────────────────────
    if (recipe.notes) {
        lines.push("### Notes");
        lines.push(recipe.notes);
        lines.push("");
    }
    return lines.join("\n").trim();
}
function formatFermentable(f, totalKg) {
    const pct = totalKg && totalKg > 0 ? ` (${((f.amount / totalKg) * 100).toFixed(1)}%)` : "";
    const color = f.color ? ` — ${Math.round(f.color)} SRM` : "";
    const supplier = f.supplier ? ` — ${f.supplier}` : "";
    const use = f.use && f.use !== "Mash" ? ` — ${f.use}` : "";
    return `  • ${f.name}${supplier}: ${(0, shared_js_1.formatWeight)(f.amount)}${pct}${color}${use}`;
}
function formatHop(h) {
    const time = h.time != null
        ? ` @ ${h.time} ${h.timeUnit ?? "min"}`
        : "";
    const ibu = h.ibu ? ` — ${Math.round(h.ibu)} IBU` : "";
    const origin = h.origin ? ` (${h.origin})` : "";
    const temp = h.temp != null ? ` — stand at ${h.temp}°C` : "";
    return `  • ${h.name}${origin} — ${(0, shared_js_1.formatWeight)(h.amount / 1000)} — ${h.type} — ${h.use}${time}${ibu} (${h.alpha.toFixed(1)}% AA)${temp}`;
}
function formatYeastInRecipe(y) {
    const lab = y.laboratory ? `${y.laboratory} ` : "";
    const pid = y.productId ? `${y.productId} — ` : "";
    const form = `${y.form} ${y.type}`;
    const temp = y.minTemp != null && y.maxTemp != null
        ? ` — ${y.minTemp}–${y.maxTemp}°C`
        : "";
    const atten = y.minAttenuation != null && y.maxAttenuation != null
        ? ` — ${y.minAttenuation}–${y.maxAttenuation}% attenuation`
        : y.attenuation
            ? ` — ${y.attenuation}% attenuation`
            : "";
    const floc = y.flocculation ? ` — ${y.flocculation} flocculation` : "";
    const amount = y.amount != null ? ` — ${y.amount} ${y.unit}` : "";
    const starter = y.starter ? " — starter recommended" : "";
    return `  • ${lab}${pid}${y.name} — ${form}${amount}${temp}${atten}${floc}${starter}`;
}
function formatMiscInRecipe(m) {
    const time = m.time != null ? ` @ ${m.time} ${m.timeUnit ?? "min"}` : "";
    const note = m.notes ? ` — ${m.notes}` : "";
    return `  • ${m.name} — ${m.amount} ${m.unit} — ${m.type} — ${m.use}${time}${note}`;
}
function formatMashStep(s) {
    return `  • ${s.name}: ${(0, shared_js_1.formatTemp)(s.stepTemp)} for ${s.stepTime} min (${s.type})`;
}
function formatFermentationStep(s) {
    const ramp = s.rampTime ? ` (ramp: ${s.rampTime}h)` : "";
    const duration = s.stepTime ? ` for ${s.stepTime} day${s.stepTime !== 1 ? "s" : ""}` : "";
    return `  • ${s.name}: ${(0, shared_js_1.formatTemp)(s.stepTemp)}${duration}${ramp}`;
}
function formatRecipeList(recipes) {
    if (recipes.length === 0)
        return "No recipes found.";
    const header = `Found ${recipes.length} recipe${recipes.length !== 1 ? "s" : ""}:\n`;
    const items = recipes.map((r, i) => formatRecipeSummary(r, i)).join("\n");
    return header + "\n" + items;
}
