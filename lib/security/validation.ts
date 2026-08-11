/**
 * Cybersecurity Validation & Input Sanitization Framework
 * Ensures all incoming payloads to invoice engine and API handlers are sanitized
 */

export interface RawCategoryInput {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  targetPercent: number;
  vatRate: number;
}

export interface SanitizedCategory {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  targetPercent: number;
  vatRate: number;
}

export interface GenerateInvoicePayload {
  orderId: string;
  customerTckn: string;
  totalAmount: number;
  categories: RawCategoryInput[];
}

/**
 * Sanitizes text input to prevent XSS / Injection attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "") // Strip HTML tags
    .trim()
    .slice(0, 100); // Limit string length
}

/**
 * Validates TCKN / VKN format (Must be 11 digits)
 */
export function isValidTckn(tckn: string): boolean {
  const sanitized = sanitizeString(tckn);
  return /^\d{11}$/.test(sanitized);
}

/**
 * Validates invoice payload rules & mathematical constraints
 */
export function validateInvoicePayload(payload: GenerateInvoicePayload): {
  isValid: boolean;
  error?: string;
  sanitized?: GenerateInvoicePayload;
} {
  if (!payload || typeof payload !== "object") {
    return { isValid: false, error: "Geçersiz istek gövdesi." };
  }

  const orderId = sanitizeString(payload.orderId);
  const customerTckn = sanitizeString(payload.customerTckn);
  const totalAmount = Number(payload.totalAmount);

  if (!orderId) {
    return { isValid: false, error: "Sipariş numarası zorunludur." };
  }

  if (customerTckn !== "11111111111") {
    return {
      isValid: false,
      error: "Yalnızca varsayılan TCKN (11111111111) olan siparişler işlenebilir.",
    };
  }

  if (isNaN(totalAmount) || totalAmount <= 0) {
    return { isValid: false, error: "Pozitif ve geçerli bir sipariş tutarı girilmelidir." };
  }

  if (!Array.isArray(payload.categories) || payload.categories.length === 0) {
    return { isValid: false, error: "En az bir KDV kategorisi eklenmelidir." };
  }

  const sanitizedCategories: SanitizedCategory[] = [];
  let totalPercent = 0;

  for (const cat of payload.categories) {
    const name = sanitizeString(cat.name);
    const minPrice = Number(cat.minPrice);
    const maxPrice = Number(cat.maxPrice);
    const targetPercent = Number(cat.targetPercent);
    const vatRate = Number(cat.vatRate);

    if (!name) {
      return { isValid: false, error: "Kategori adı boş olamaz." };
    }

    if (isNaN(minPrice) || minPrice < 0) {
      return { isValid: false, error: `${name} için minimum fiyat geçersiz.` };
    }

    if (isNaN(maxPrice) || maxPrice < minPrice) {
      return { isValid: false, error: `${name} için maksimum fiyat minimum fiyattan küçük olamaz.` };
    }

    if (isNaN(targetPercent) || targetPercent < 0 || targetPercent > 100) {
      return { isValid: false, error: `${name} için hedef yüzde geçersiz.` };
    }

    if (![8, 10, 20].includes(vatRate)) {
      return { isValid: false, error: `${name} için geçerli bir KDV oranı (%8, %10, %20) seçilmelidir.` };
    }

    totalPercent += targetPercent;
    sanitizedCategories.push({
      id: cat.id || `cat_${Math.random()}`,
      name,
      minPrice,
      maxPrice,
      targetPercent,
      vatRate,
    });
  }

  // Exact 100% sum check (allowing tiny floating point rounding tolerances e.g. 99.999 to 100.001)
  if (Math.abs(totalPercent - 100) > 0.01) {
    return {
      isValid: false,
      error: `Kategori hedef yüzdeleri toplamı kesinlikle %100 olmalıdır. (Şu anki toplam: %${totalPercent.toFixed(1)})`,
    };
  }

  return {
    isValid: true,
    sanitized: {
      orderId,
      customerTckn,
      totalAmount,
      categories: sanitizedCategories,
    },
  };
}
