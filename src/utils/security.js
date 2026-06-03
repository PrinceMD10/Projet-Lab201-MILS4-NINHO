const MAX_TEXT_LENGTH = 5000;
const SAFE_IMAGE_PATH = "/images/ninho-mils4-poster.svg";

export function cleanText(value, maxLength = MAX_TEXT_LENGTH) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function cleanNumber(value, { min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0 } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(number, min), max);
}

export function isSafeExternalUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function safeExternalUrl(value, fallback = "#") {
  return isSafeExternalUrl(value) ? String(value) : fallback;
}

export function safeImagePath(value) {
  const clean = cleanText(value, 256);
  if (/^\/images\/[A-Za-z0-9._/-]+\.(svg|png|jpg|jpeg|webp)$/i.test(clean) && !clean.includes("..")) {
    return clean;
  }
  return SAFE_IMAGE_PATH;
}

export function safeDate(value) {
  const clean = cleanText(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(clean) ? clean : "";
}

export function safeEmail(value) {
  const clean = cleanText(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? clean : "";
}
