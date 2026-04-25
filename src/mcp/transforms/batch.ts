import {
  BatchSummary,
  BatchDetail,
  SensorReading,
  BrewTrackerState,
  BatchFermentable,
  BatchHop,
  BatchMisc,
  BatchYeast,
  BatchMeasurement,
} from "../types";
import {
  formatDate,
  formatDateShort,
  formatGravity,
  formatAbv,
  formatIbu,
  formatColor,
  formatWeight,
  formatVolume,
  formatTemp,
  formatPercentage,
  formatRating,
  safeText,
} from "./shared";

export function formatBatchSummary(batch: BatchSummary, index?: number): string {
  const prefix = index != null ? `[${index + 1}] ` : "";
  const name = batch.name ?? "Unnamed Batch";
  const no = batch.batchNo ? ` (#${batch.batchNo})` : "";
  const style = batch.recipe?.style?.name ? ` — ${batch.recipe.style.name}` : "";
  const og = batch.measuredOg
    ? `OG: ${formatGravity(batch.measuredOg)} (measured)`
    : batch.estimatedOg
    ? `OG: ${formatGravity(batch.estimatedOg)} (estimated)`
    : "OG: Unknown";
  const abv = batch.measuredAbv
    ? formatAbv(batch.measuredAbv)
    : formatAbv(batch.estimatedAbv);
  const brewDate = batch.brewDate
    ? `Brewed: ${formatDateShort(batch.brewDate)}`
    : "Not yet brewed";

  return `${prefix}"${name}"${no}${style} — ${batch.status} — ${og} — ${abv} — ${brewDate} [ID: ${batch._id}]`;
}

export function formatBatchDetail(batch: BatchDetail): string {
  const lines: string[] = [];
  const name = batch.name ?? "Unnamed Batch";
  const no = batch.batchNo ? ` (#${batch.batchNo})` : "";

  // ── Overview ──────────────────────────────────────────────────────────────
  lines.push(`## Batch: "${name}"${no}`);
  lines.push(`ID: ${batch._id}`);
  lines.push(`Status: ${batch.status}`);
  if (batch.brewer) lines.push(`Brewer: ${batch.brewer}`);
  if (batch.recipe?.style?.name) lines.push(`Style: ${batch.recipe.style.name}`);
  if (batch.recipe?.name) lines.push(`Recipe: "${batch.recipe.name}"`);
  if (batch.tasteRating != null) lines.push(`Taste: ${formatRating(batch.tasteRating)}`);
  if (batch.tasteNotes) lines.push(`Taste notes: ${batch.tasteNotes}`);
  if (batch.info) lines.push(`Info: ${batch.info}`);
  lines.push("");

  // ── Timeline ──────────────────────────────────────────────────────────────
  lines.push("### Timeline");
  lines.push(`Brew date: ${formatDate(batch.brewDate)}`);
  lines.push(`Fermentation start: ${formatDate(batch.fermentationStartDate)}`);
  lines.push(`Bottling/packaging: ${formatDate(batch.bottlingDate)}`);
  lines.push("");

  // ── Gravity & Fermentation ────────────────────────────────────────────────
  lines.push("### Gravity & Fermentation");
  lines.push(
    `Original Gravity (OG): ${formatGravity(batch.measuredOg)} measured / ${formatGravity(batch.estimatedOg)} estimated`
  );
  lines.push(
    `Final Gravity (FG): ${formatGravity(batch.measuredFg)} measured / ${formatGravity(batch.estimatedFg)} estimated`
  );
  if (batch.measuredFirstWortGravity)
    lines.push(`First Wort Gravity: ${formatGravity(batch.measuredFirstWortGravity)}`);
  if (batch.measuredPreBoilGravity)
    lines.push(`Pre-Boil Gravity: ${formatGravity(batch.measuredPreBoilGravity)}`);
  if (batch.measuredPostBoilGravity)
    lines.push(`Post-Boil Gravity: ${formatGravity(batch.measuredPostBoilGravity)}`);
  if (batch.measuredMashPh)
    lines.push(`Mash pH: ${batch.measuredMashPh.toFixed(2)}`);
  lines.push(
    `ABV: ${formatAbv(batch.measuredAbv)} measured / ${formatAbv(batch.estimatedAbv)} estimated`
  );
  lines.push(
    `Attenuation: ${formatPercentage(batch.measuredAttenuation)} measured`
  );
  lines.push("");

  // ── Bitterness & Color ────────────────────────────────────────────────────
  lines.push("### Character");
  lines.push(`IBU: ${formatIbu(batch.estimatedIbu)}`);
  lines.push(`Color: ${formatColor(batch.estimatedColor)}`);
  lines.push("");

  // ── Volumes & Efficiency ──────────────────────────────────────────────────
  lines.push("### Volumes & Efficiency");
  lines.push(`Batch size: ${formatVolume(batch.measuredBatchSize)} measured / ${formatVolume(batch.recipe?.batchSize)} target`);
  lines.push(`Kettle size: ${formatVolume(batch.measuredKettleSize)}`);
  lines.push(`Boil size: ${formatVolume(batch.measuredBoilSize)}`);
  lines.push(`Fermenter top-up: ${formatVolume(batch.measuredFermenterTopUp)}`);
  lines.push(`Bottling size: ${formatVolume(batch.measuredBottlingSize)}`);
  if (batch.measuredBottlingTemp)
    lines.push(`Bottling temp: ${formatTemp(batch.measuredBottlingTemp)}`);
  lines.push(`Brewhouse efficiency: ${formatPercentage(batch.measuredEfficiency)}`);
  lines.push(`Mash efficiency: ${formatPercentage(batch.measuredMashEfficiency)}`);
  lines.push(`Kettle efficiency: ${formatPercentage(batch.measuredKettleEfficiency)}`);
  lines.push("");

  // ── Carbonation ───────────────────────────────────────────────────────────
  if (batch.carbonationType || batch.carbonationTemp != null) {
    lines.push("### Carbonation");
    if (batch.carbonationType) lines.push(`Method: ${batch.carbonationType}`);
    if (batch.carbonationTemp != null)
      lines.push(`Temperature: ${formatTemp(batch.carbonationTemp)}`);
    if (batch.carbonationForce != null)
      lines.push(`Force: ${batch.carbonationForce.toFixed(1)} PSI`);
    if (batch.primingSugarEquiv != null)
      lines.push(`Priming sugar equiv: ${batch.primingSugarEquiv.toFixed(1)} g/L`);
    lines.push("");
  }

  // ── Ingredients ───────────────────────────────────────────────────────────
  // Use batch-level confirmed ingredients when available; fall back to the
  // embedded recipe when the batch hasn't had ingredients confirmed yet.
  const fermentables = batch.batchFermentables?.length > 0
    ? batch.batchFermentables
    : null;
  const recipeFermentables = batch.recipe?.fermentables ?? [];

  if (fermentables) {
    lines.push("### Fermentables");
    fermentables.forEach((f) => lines.push(formatBatchFermentable(f)));
    lines.push("");
  } else if (recipeFermentables.length > 0) {
    lines.push("### Fermentables (from recipe)");
    recipeFermentables.forEach((f) => {
      const pct = f.percentage != null ? ` (${f.percentage.toFixed(1)}%)` : "";
      const color = f.color ? ` — ${Math.round(f.color)} SRM` : "";
      const supplier = f.supplier ? ` — ${f.supplier}` : "";
      lines.push(`  • ${f.name}${supplier}: ${formatWeight(f.amount)}${pct}${color}`);
    });
    lines.push("");
  }

  const hops = batch.batchHops?.length > 0 ? batch.batchHops : null;
  const recipeHops = batch.recipe?.hops ?? [];

  if (hops) {
    const dryHops = hops.filter((h) => h.use === "Dry Hop");
    const otherHops = hops.filter((h) => h.use !== "Dry Hop");
    if (otherHops.length > 0) {
      lines.push("### Hops");
      otherHops.forEach((h) => lines.push(formatBatchHop(h)));
      lines.push("");
    }
    if (dryHops.length > 0) {
      lines.push("### Dry Hop Schedule");
      dryHops.forEach((h) => lines.push(formatBatchHop(h)));
      lines.push("");
    }
  } else if (recipeHops.length > 0) {
    const dryHops = recipeHops.filter((h) => h.use === "Dry Hop");
    const otherHops = recipeHops.filter((h) => h.use !== "Dry Hop");
    if (otherHops.length > 0) {
      lines.push("### Hops (from recipe)");
      otherHops.forEach((h) => {
        const time = h.time != null ? ` @ ${h.time} ${h.timeUnit ?? "min"}` : "";
        const ibu = h.ibu ? ` — ${Math.round(h.ibu)} IBU` : "";
        lines.push(`  • ${h.name} — ${formatWeight(h.amount / 1000)} — ${h.type} — ${h.use}${time}${ibu} (${h.alpha.toFixed(1)}% AA)`);
      });
      lines.push("");
    }
    if (dryHops.length > 0) {
      lines.push("### Dry Hop Schedule (from recipe)");
      // Add fermentation context if available
      const fermentation = batch.recipe?.fermentation;
      if (fermentation?.steps && fermentation.steps.length > 0) {
        lines.push("Fermentation profile: " + fermentation.steps.map((s) => `${s.type ?? s.name} @ ${s.stepTemp}°C`).join(" → "));
      }
      dryHops.forEach((h) => {
        const time = h.time != null ? ` — add @ day ${h.time} of fermentation` : "";
        lines.push(`  • ${h.name} — ${formatWeight(h.amount / 1000)} — ${h.type} (${h.alpha.toFixed(1)}% AA)${time}`);
      });
      lines.push("");
    }
  }

  const yeasts = batch.batchYeasts?.length > 0 ? batch.batchYeasts : null;
  const recipeYeasts = batch.recipe?.yeasts ?? [];

  if (yeasts) {
    lines.push("### Yeasts");
    yeasts.forEach((y) => lines.push(formatBatchYeast(y)));
    lines.push("");
  } else if (recipeYeasts.length > 0) {
    lines.push("### Yeasts (from recipe)");
    recipeYeasts.forEach((y) => {
      const lab = y.laboratory ? ` (${y.laboratory}` : "";
      const pid = y.productId ? ` ${y.productId})` : lab ? ")" : "";
      lines.push(`  • ${y.name}${lab}${pid} — ${y.form}`);
    });
    lines.push("");
  }


  const miscs = batch.batchMiscs?.length > 0 ? batch.batchMiscs : null;
  const recipeMiscs = batch.recipe?.miscs ?? [];

  if (miscs) {
    lines.push("### Miscellaneous");
    miscs.forEach((m) => lines.push(formatBatchMisc(m)));
    lines.push("");
  } else if (recipeMiscs.length > 0) {
    lines.push("### Miscellaneous (from recipe)");
    recipeMiscs.forEach((m) => {
      const time = m.time != null ? ` @ ${m.time} ${m.timeUnit ?? "min"}` : "";
      lines.push(`  • ${m.name} — ${m.amount} ${m.unit} — ${m.use}${time}`);
    });
    lines.push("");
  }

  // ── Fermentation Profile ─────────────────────────────────────────────────
  const fermentation = batch.recipe?.fermentation;
  if (fermentation && fermentation.steps && fermentation.steps.length > 0) {
    lines.push("### Fermentation Profile: " + fermentation.name);
    fermentation.steps.forEach((s) => {
      const ramp = s.ramp ? ` (ramp: ${s.ramp}h)` : "";
      const duration = s.stepTime ? ` for ${s.stepTime} day${s.stepTime !== 1 ? "s" : ""}` : "";
      lines.push(`  • ${s.type ?? s.name}: ${formatTemp(s.stepTemp)}${duration}${ramp}`);
    });
    lines.push("");
  }

  // ── Notes ─────────────────────────────────────────────────────────────────
  if (batch.batchNotes) {
    lines.push("### Batch Notes");
    lines.push(batch.batchNotes);
    lines.push("");
  }

  const logEntries = batch.notes?.filter((n) => n.note) ?? [];
  if (logEntries.length > 0) {
    lines.push("### Log Entries");
    logEntries.forEach((note) => {
      const ts = formatDate(note.timestamp);
      const status = note.status ? ` [${note.status}]` : "";
      lines.push(`${ts}${status}: ${note.note}`);
    });
    lines.push("");
  }

  if (batch.measurements?.length > 0) {
    lines.push("### Fermentation Log");
    batch.measurements.forEach((m) => lines.push(formatBatchMeasurement(m)));
    lines.push("");
  }

  if (batch.events?.length > 0) {
    lines.push("### Events");
    batch.events.forEach((e) => {
      const label = e.eventText ?? e.description ?? e.title;
      lines.push(`  • ${formatDateShort(e.time)}: ${label}`);
    });
    lines.push("");
  }

  return lines.join("\n").trim();
}

function formatBatchFermentable(f: BatchFermentable): string {
  const parts = [
    `  • ${f.name}`,
    `${formatWeight(f.amount)}`,
    ...(f.percentage != null ? [`${f.percentage.toFixed(1)}%`] : []),
  ];
  if (f.color) parts.push(`${Math.round(f.color)} SRM`);
  if (f.use) parts.push(f.use);
  if (f.supplier) parts.push(`(${f.supplier})`);
  return parts.join(" — ");
}

function formatBatchHop(h: BatchHop): string {
  const time = h.time != null ? ` @ ${h.time} ${h.timeUnit ?? "min"}` : "";
  const ibu = h.ibu ? ` — ${Math.round(h.ibu)} IBU` : "";
  return `  • ${h.name} — ${formatWeight(h.amount / 1000)} — ${h.type} — ${h.use}${time}${ibu} (${h.alpha.toFixed(1)}% AA)`;
}

function formatBatchYeast(y: BatchYeast): string {
  const lab = y.laboratory ? ` (${y.laboratory}` : "";
  const pid = y.productId ? ` ${y.productId})` : lab ? ")" : "";
  const temp =
    y.minTemp != null && y.maxTemp != null
      ? ` — ${y.minTemp}–${y.maxTemp}°C`
      : "";
  const atten = y.attenuation ? ` — ${y.attenuation}% attenuation` : "";
  const amount = y.amount != null ? ` — ${y.amount} ${y.unit}` : "";
  return `  • ${y.name}${lab}${pid} — ${y.form}${amount}${temp}${atten}`;
}

function formatBatchMisc(m: BatchMisc): string {
  const time = m.time != null ? ` @ ${m.time} ${m.timeUnit ?? "min"}` : "";
  return `  • ${m.name} — ${m.amount} ${m.unit} — ${m.use}${time}`;
}

function formatBatchMeasurement(m: BatchMeasurement): string {
  const parts: string[] = [formatDate(m.time)];
  if (m.sg != null) parts.push(`SG: ${formatGravity(m.sg)}`);
  if (m.temp != null) parts.push(`Temp: ${formatTemp(m.temp)}`);
  if (m.ph != null) parts.push(`pH: ${m.ph.toFixed(2)}`);
  if (m.pressure != null) parts.push(`Pressure: ${m.pressure.toFixed(2)} PSI`);
  if (m.type) parts.push(`[${m.type}]`);
  if (m.comment) parts.push(`— ${m.comment}`);
  return `  • ${parts.join(" | ")}`;
}

export function formatReading(reading: SensorReading): string {
  const time = formatDate(reading.time);
  const parts: string[] = [`Time: ${time}`];
  if (reading.sg != null) parts.push(`Gravity: ${formatGravity(reading.sg)}`);
  if (reading.temp != null) parts.push(`Temp: ${formatTemp(reading.temp)}`);
  if (reading.ph != null) parts.push(`pH: ${reading.ph.toFixed(2)}`);
  if (reading.pressure != null) parts.push(`Pressure: ${reading.pressure.toFixed(2)} PSI`);
  if (reading.battery != null) parts.push(`Battery: ${reading.battery.toFixed(0)}%`);
  if (reading.type) parts.push(`Source: ${reading.type}`);
  if (reading.comment) parts.push(`Comment: ${reading.comment}`);
  return parts.join(" | ");
}

export function formatReadingsList(readings: SensorReading[]): string {
  if (readings.length === 0) return "No readings recorded.";
  const lines = readings.map((r) => formatReading(r));
  return `Found ${readings.length} reading${readings.length !== 1 ? "s" : ""}:\n\n${lines.join("\n")}`;
}

export function formatBrewTracker(tracker: BrewTrackerState): string {
  if (!tracker || Object.keys(tracker).length === 0) {
    return "Brew Tracker is not active for this batch.";
  }

  const lines: string[] = ["## Brew Tracker"];
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

export function formatBatchList(batches: BatchSummary[]): string {
  if (batches.length === 0) return "No batches found matching the criteria.";
  const header = `Found ${batches.length} batch${batches.length !== 1 ? "es" : ""}:\n`;
  const items = batches.map((b, i) => formatBatchSummary(b, i)).join("\n");
  return header + "\n" + items;
}

export function formatUpdateConfirmation(batch: BatchDetail): string {
  return `Batch updated successfully.\n\n${formatBatchDetail(batch)}`;
}
