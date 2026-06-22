// Centralized null-safe formatters used across cards, detail and compare pages.

export function formatINR(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
  if (value >= 10000000) return `\u20B9${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `\u20B9${(value / 100000).toFixed(2)} L`;
  return `\u20B9${Number(value).toLocaleString('en-IN')}`;
}

export function formatRating(value) {
  if (value === null || value === undefined) return 'N/A';
  return Number(value).toFixed(1);
}

export function safe(value, fallback = 'N/A') {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
}
