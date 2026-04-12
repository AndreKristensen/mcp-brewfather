"use strict";
/**
 * Shared formatting utilities for transforming raw Brewfather API data
 * into human-readable text for AI consumption.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatDateShort = formatDateShort;
exports.formatGravity = formatGravity;
exports.formatAbv = formatAbv;
exports.formatIbu = formatIbu;
exports.formatColor = formatColor;
exports.formatWeight = formatWeight;
exports.formatVolume = formatVolume;
exports.formatTemp = formatTemp;
exports.formatPercentage = formatPercentage;
exports.formatMinutes = formatMinutes;
exports.formatTime = formatTime;
exports.formatRating = formatRating;
exports.safeText = safeText;
function formatDate(unixMs) {
    if (!unixMs)
        return "Not set";
    return new Date(unixMs).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
function formatDateShort(unixMs) {
    if (!unixMs)
        return "Not set";
    return new Date(unixMs).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
function formatGravity(sg) {
    if (!sg)
        return "Not measured";
    // Convert SG to approximate Plato: °P ≈ (SG - 1) * 1000 / 4
    const plato = ((sg - 1) * 1000) / 4;
    return `${sg.toFixed(3)} SG (~${plato.toFixed(1)}°P)`;
}
function formatAbv(abv) {
    if (abv == null)
        return "Not calculated";
    return `${abv.toFixed(1)}% ABV`;
}
function formatIbu(ibu) {
    if (ibu == null)
        return "Not calculated";
    return `${Math.round(ibu)} IBU`;
}
function formatColor(srm) {
    if (srm == null)
        return "Not calculated";
    return `${Math.round(srm)} SRM`;
}
/** Auto-selects kg or g based on magnitude */
function formatWeight(kg) {
    if (kg == null)
        return "Not set";
    if (kg >= 1)
        return `${kg.toFixed(2)} kg`;
    return `${(kg * 1000).toFixed(0)} g`;
}
function formatVolume(liters) {
    if (liters == null)
        return "Not set";
    return `${liters.toFixed(1)} L`;
}
/** Formats temperature in both Celsius and Fahrenheit */
function formatTemp(celsius) {
    if (celsius == null)
        return "Not set";
    const f = (celsius * 9) / 5 + 32;
    return `${celsius.toFixed(1)}°C (${f.toFixed(1)}°F)`;
}
function formatPercentage(val) {
    if (val == null)
        return "Not calculated";
    return `${val.toFixed(1)}%`;
}
function formatMinutes(minutes) {
    if (minutes == null)
        return "Not set";
    if (minutes < 60)
        return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
}
function formatTime(value, unit) {
    if (value == null)
        return "Not set";
    const u = unit ?? "min";
    if (u === "min")
        return `${value} min`;
    if (u === "day")
        return `${value} day${value !== 1 ? "s" : ""}`;
    if (u === "days")
        return `${value} day${value !== 1 ? "s" : ""}`;
    return `${value} ${u}`;
}
function formatRating(rating) {
    if (rating == null)
        return "Not rated";
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    return `${stars} (${rating}/5)`;
}
function safeText(val) {
    return val?.trim() || "—";
}
