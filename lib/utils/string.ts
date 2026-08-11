/**
 * Normalizes Turkish string characters for accent-insensitive search
 * Converts 'ö'->'o', 'ğ'->'g', 'ş'->'s', 'ü'->'u', 'ç'->'c', 'ı'->'i', etc.
 */
export function normalizeTurkish(str: string): string {
  if (!str) return "";
  return str
    .replace(/Ğ/g, "g")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/ş/g, "s")
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .replace(/Ö/g, "o")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/ç/g, "c")
    .toLowerCase()
    .trim();
}
