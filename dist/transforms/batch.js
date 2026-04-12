"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBatchSummary = formatBatchSummary;
exports.formatBatchDetail = formatBatchDetail;
exports.formatReading = formatReading;
exports.formatReadingsList = formatReadingsList;
exports.formatBrewTracker = formatBrewTracker;
exports.formatBatchList = formatBatchList;
exports.formatUpdateConfirmation = formatUpdateConfirmation;
const shared_js_1 = require("./shared.js");
function formatBatchSummary(batch, index) {
    const prefix = index != null ? `[${index + 1}] ` : "";
    const name = batch.name ?? "Unnamed Batch";
    const no = batch.batchNo ? ` (#${batch.batchNo})` : "";
    const style = batch.recipe?.style?.name ? ` — ${batch.recipe.style.name}` : "";
    const og = batch.measuredOg
        ? `OG: ${(0, shared_js_1.formatGravity)(batch.measuredOg)} (measured)`
        : batch.estimatedOg
            ? `OG: ${(0, shared_js_1.formatGravity)(batch.estimatedOg)} (estimated)`
            : "OG: Unknown";
    const abv = batch.measuredAbv
        ? (0, shared_js_1.formatAbv)(batch.measuredAbv)
        : (0, shared_js_1.formatAbv)(batch.estimatedAbv);
    const brewDate = batch.brewDate
        ? `Brewed: ${(0, shared_js_1.formatDateShort)(batch.brewDate)}`
        : "Not yet brewed";
    return `${prefix}"${name}"${no}${style} — ${batch.status} — ${og} — ${abv} — ${brewDate}`;
}
function formatBatchDetail(batch) {
    const lines = [];
    const name = batch.name ?? "Unnamed Batch";
    const no = batch.batchNo ? ` (#${batch.batchNo})` : "";
    // ── Overview ──────────────────────────────────────────────────────────────
    lines.push(`## Batch: "${name}"${no}`);
    lines.push(`Status: ${batch.status}`);
    if (batch.brewer)
        lines.push(`Brewer: ${batch.brewer}`);
    if (batch.recipe?.style?.name)
        lines.push(`Style: ${batch.recipe.style.name}`);
    if (batch.recipe?.name)
        lines.push(`Recipe: "${batch.recipe.name}"`);
    if (batch.tasteRating != null)
        lines.push(`Taste: ${(0, shared_js_1.formatRating)(batch.tasteRating)}`);
    if (batch.tasteNotes)
        lines.push(`Taste notes: ${batch.tasteNotes}`);
    lines.push("");
    // ── Timeline ──────────────────────────────────────────────────────────────
    lines.push("### Timeline");
    lines.push(`Brew date: ${(0, shared_js_1.formatDate)(batch.brewDate)}`);
    lines.push(`Fermentation start: ${(0, shared_js_1.formatDate)(batch.fermentationStartDate)}`);
    lines.push(`Bottling/packaging: ${(0, shared_js_1.formatDate)(batch.bottlingDate)}`);
    lines.push("");
    // ── Gravity & Fermentation ────────────────────────────────────────────────
    lines.push("### Gravity & Fermentation");
    lines.push(`Original Gravity (OG): ${(0, shared_js_1.formatGravity)(batch.measuredOg)} measured / ${(0, shared_js_1.formatGravity)(batch.estimatedOg)} estimated`);
    lines.push(`Final Gravity (FG): ${(0, shared_js_1.formatGravity)(batch.measuredFg)} measured / ${(0, shared_js_1.formatGravity)(batch.estimatedFg)} estimated`);
    if (batch.measuredFirstWortGravity)
        lines.push(`First Wort Gravity: ${(0, shared_js_1.formatGravity)(batch.measuredFirstWortGravity)}`);
    if (batch.measuredPreBoilGravity)
        lines.push(`Pre-Boil Gravity: ${(0, shared_js_1.formatGravity)(batch.measuredPreBoilGravity)}`);
    if (batch.measuredPostBoilGravity)
        lines.push(`Post-Boil Gravity: ${(0, shared_js_1.formatGravity)(batch.measuredPostBoilGravity)}`);
    if (batch.measuredMashPh)
        lines.push(`Mash pH: ${batch.measuredMashPh.toFixed(2)}`);
    lines.push(`ABV: ${(0, shared_js_1.formatAbv)(batch.measuredAbv)} measured / ${(0, shared_js_1.formatAbv)(batch.estimatedAbv)} estimated`);
    lines.push(`Attenuation: ${(0, shared_js_1.formatPercentage)(batch.measuredAttenuation)} measured`);
    lines.push("");
    // ── Bitterness & Color ────────────────────────────────────────────────────
    lines.push("### Character");
    lines.push(`IBU: ${(0, shared_js_1.formatIbu)(batch.estimatedIbu)}`);
    lines.push(`Color: ${(0, shared_js_1.formatColor)(batch.estimatedColor)}`);
    lines.push("");
    // ── Volumes & Efficiency ──────────────────────────────────────────────────
    lines.push("### Volumes & Efficiency");
    lines.push(`Batch size: ${(0, shared_js_1.formatVolume)(batch.measuredBatchSize)} measured / ${(0, shared_js_1.formatVolume)(batch.recipe?.batchSize)} target`);
    lines.push(`Kettle size: ${(0, shared_js_1.formatVolume)(batch.measuredKettleSize)}`);
    lines.push(`Boil size: ${(0, shared_js_1.formatVolume)(batch.measuredBoilSize)}`);
    lines.push(`Fermenter top-up: ${(0, shared_js_1.formatVolume)(batch.measuredFermenterTopUp)}`);
    lines.push(`Bottling size: ${(0, shared_js_1.formatVolume)(batch.measuredBottlingSize)}`);
    if (batch.measuredBottlingTemp)
        lines.push(`Bottling temp: ${(0, shared_js_1.formatTemp)(batch.measuredBottlingTemp)}`);
    lines.push(`Brewhouse efficiency: ${(0, shared_js_1.formatPercentage)(batch.measuredEfficiency)}`);
    lines.push(`Mash efficiency: ${(0, shared_js_1.formatPercentage)(batch.measuredMashEfficiency)}`);
    lines.push(`Kettle efficiency: ${(0, shared_js_1.formatPercentage)(batch.measuredKettleEfficiency)}`);
    lines.push("");
    // ── Carbonation ───────────────────────────────────────────────────────────
    if (batch.carbonationType || batch.carbonationTemp != null) {
        lines.push("### Carbonation");
        if (batch.carbonationType)
            lines.push(`Method: ${batch.carbonationType}`);
        if (batch.carbonationTemp != null)
            lines.push(`Temperature: ${(0, shared_js_1.formatTemp)(batch.carbonationTemp)}`);
        if (batch.carbonationForce != null)
            lines.push(`Force: ${batch.carbonationForce.toFixed(1)} PSI`);
        if (batch.primingSugarEquiv != null)
            lines.push(`Priming sugar equiv: ${batch.primingSugarEquiv.toFixed(1)} g/L`);
        lines.push("");
    }
    // ── Ingredients ───────────────────────────────────────────────────────────
    if (batch.batchFermentables?.length > 0) {
        lines.push("### Fermentables");
        batch.batchFermentables.forEach((f) => lines.push(formatBatchFermentable(f)));
        lines.push("");
    }
    if (batch.batchHops?.length > 0) {
        lines.push("### Hops");
        batch.batchHops.forEach((h) => lines.push(formatBatchHop(h)));
        lines.push("");
    }
    if (batch.batchYeasts?.length > 0) {
        lines.push("### Yeasts");
        batch.batchYeasts.forEach((y) => lines.push(formatBatchYeast(y)));
        lines.push("");
    }
    if (batch.batchMiscs?.length > 0) {
        lines.push("### Miscellaneous");
        batch.batchMiscs.forEach((m) => lines.push(formatBatchMisc(m)));
        lines.push("");
    }
    // ── Notes ─────────────────────────────────────────────────────────────────
    if (batch.batchNotes) {
        lines.push("### Batch Notes");
        lines.push(batch.batchNotes);
        lines.push("");
    }
    if (batch.notes?.length > 0) {
        lines.push("### Log Entries");
        batch.notes.forEach((note) => {
            const ts = (0, shared_js_1.formatDate)(note.timestamp);
            const status = note.status ? ` [${note.status}]` : "";
            lines.push(`${ts}${status}: ${note.note}`);
        });
        lines.push("");
    }
    return lines.join("\n").trim();
}
function formatBatchFermentable(f) {
    const parts = [
        `  • ${f.name}`,
        `${(0, shared_js_1.formatWeight)(f.amount)}`,
        `${f.percentage.toFixed(1)}%`,
    ];
    if (f.color)
        parts.push(`${Math.round(f.color)} SRM`);
    if (f.use)
        parts.push(f.use);
    if (f.supplier)
        parts.push(`(${f.supplier})`);
    return parts.join(" — ");
}
function formatBatchHop(h) {
    const time = h.time != null ? ` @ ${h.time} ${h.timeUnit ?? "min"}` : "";
    const ibu = h.ibu ? ` — ${Math.round(h.ibu)} IBU` : "";
    return `  • ${h.name} — ${(0, shared_js_1.formatWeight)(h.amount / 1000)} — ${h.type} — ${h.use}${time}${ibu} (${h.alpha.toFixed(1)}% AA)`;
}
function formatBatchYeast(y) {
    const lab = y.laboratory ? ` (${y.laboratory}` : "";
    const pid = y.productId ? ` ${y.productId})` : lab ? ")" : "";
    const temp = y.minTemp != null && y.maxTemp != null
        ? ` — ${y.minTemp}–${y.maxTemp}°C`
        : "";
    const atten = y.attenuation ? ` — ${y.attenuation}% attenuation` : "";
    const amount = y.amount != null ? ` — ${y.amount} ${y.unit}` : "";
    return `  • ${y.name}${lab}${pid} — ${y.form}${amount}${temp}${atten}`;
}
function formatBatchMisc(m) {
    const time = m.time != null ? ` @ ${m.time} ${m.timeUnit ?? "min"}` : "";
    return `  • ${m.name} — ${m.amount} ${m.unit} — ${m.use}${time}`;
}
function formatReading(reading) {
    const time = (0, shared_js_1.formatDate)(reading.time);
    const parts = [`Time: ${time}`];
    if (reading.sg != null)
        parts.push(`Gravity: ${(0, shared_js_1.formatGravity)(reading.sg)}`);
    if (reading.temp != null)
        parts.push(`Temp: ${(0, shared_js_1.formatTemp)(reading.temp)}`);
    if (reading.ph != null)
        parts.push(`pH: ${reading.ph.toFixed(2)}`);
    if (reading.pressure != null)
        parts.push(`Pressure: ${reading.pressure.toFixed(2)} PSI`);
    if (reading.battery != null)
        parts.push(`Battery: ${reading.battery.toFixed(0)}%`);
    if (reading.type)
        parts.push(`Source: ${reading.type}`);
    if (reading.comment)
        parts.push(`Comment: ${reading.comment}`);
    return parts.join(" | ");
}
function formatReadingsList(readings) {
    if (readings.length === 0)
        return "No readings recorded.";
    const lines = readings.map((r) => formatReading(r));
    return `Found ${readings.length} reading${readings.length !== 1 ? "s" : ""}:\n\n${lines.join("\n")}`;
}
function formatBrewTracker(tracker) {
    if (!tracker || Object.keys(tracker).length === 0) {
        return "Brew Tracker is not active for this batch.";
    }
    const lines = ["## Brew Tracker"];
    lines.push(`Status: ${tracker.completed ? "Completed" : tracker.enabled ? "Active" : "Inactive"}`);
    if (tracker.stages && tracker.stages.length > 0) {
        const currentIdx = tracker.stage ?? 0;
        lines.push(`Current stage: ${currentIdx + 1} of ${tracker.stages.length}`);
        lines.push("");
        lines.push("### Stages");
        tracker.stages.forEach((stage, i) => {
            const isCurrent = i === currentIdx;
            const done = stage.completed ? "✓" : isCurrent ? "▶" : "○";
            const duration = stage.duration ? ` (${stage.duration} min)` : "";
            lines.push(`  ${done} [${i + 1}] ${stage.name}${duration}`);
        });
    }
    return lines.join("\n");
}
function formatBatchList(batches) {
    if (batches.length === 0)
        return "No batches found matching the criteria.";
    const header = `Found ${batches.length} batch${batches.length !== 1 ? "es" : ""}:\n`;
    const items = batches.map((b, i) => formatBatchSummary(b, i)).join("\n");
    return header + "\n" + items;
}
function formatUpdateConfirmation(batch) {
    return `Batch updated successfully.\n\n${formatBatchDetail(batch)}`;
}
