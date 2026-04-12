/**
 * Shared formatting utilities for transforming raw Brewfather API data
 * into human-readable text for AI consumption.
 */

export function formatDate(unixMs: number | null | undefined): string {
  if (!unixMs) return "Not set";
  return new Date(unixMs).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(unixMs: number | null | undefined): string {
  if (!unixMs) return "Not set";
  return new Date(unixMs).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatGravity(sg: number | null | undefined): string {
  if (!sg) return "Not measured";
  // Convert SG to approximate Plato: °P ≈ (SG - 1) * 1000 / 4
  const plato = ((sg - 1) * 1000) / 4;
  return `${sg.toFixed(3)} SG (~${plato.toFixed(1)}°P)`;
}

export function formatAbv(abv: number | null | undefined): string {
  if (abv == null) return "Not calculated";
  return `${abv.toFixed(1)}% ABV`;
}

export function formatIbu(ibu: number | null | undefined): string {
  if (ibu == null) return "Not calculated";
  return `${Math.round(ibu)} IBU`;
}

export function formatColor(srm: number | null | undefined): string {
  if (srm == null) return "Not calculated";
  return `${Math.round(srm)} SRM`;
}

/** Auto-selects kg or g based on magnitude */
export function formatWeight(kg: number | null | undefined): string {
  if (kg == null) return "Not set";
  if (kg >= 1) return `${kg.toFixed(2)} kg`;
  return `${(kg * 1000).toFixed(0)} g`;
}

export function formatVolume(liters: number | null | undefined): string {
  if (liters == null) return "Not set";
  return `${liters.toFixed(1)} L`;
}

/** Formats temperature in both Celsius and Fahrenheit */
export function formatTemp(celsius: number | null | undefined): string {
  if (celsius == null) return "Not set";
  const f = (celsius * 9) / 5 + 32;
  return `${celsius.toFixed(1)}°C (${f.toFixed(1)}°F)`;
}

export function formatPercentage(val: number | null | undefined): string {
  if (val == null) return "Not calculated";
  return `${val.toFixed(1)}%`;
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes == null) return "Not set";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function formatTime(value: number | null | undefined, unit: string | null | undefined): string {
  if (value == null) return "Not set";
  const u = unit ?? "min";
  if (u === "min") return `${value} min`;
  if (u === "day") return `${value} day${value !== 1 ? "s" : ""}`;
  if (u === "days") return `${value} day${value !== 1 ? "s" : ""}`;
  return `${value} ${u}`;
}

export function formatRating(rating: number | null | undefined): string {
  if (rating == null) return "Not rated";
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return `${stars} (${rating}/5)`;
}

export function safeText(val: string | null | undefined): string {
  return val?.trim() || "—";
}
