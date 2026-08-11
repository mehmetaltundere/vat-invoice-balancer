/**
 * Mathematical Exact-Match Range Algorithm
 * Distributes total order amount into category lines within min-max bounds
 * and adjusts pennies (kuruş) to match order total 100.00% accurately.
 */

import { SanitizedCategory } from "@/lib/security/validation";

export interface GeneratedInvoiceLine {
  id: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalWithVat: number;
}

export interface ExactMatchResult {
  orderId: string;
  totalOriginalAmount: number;
  totalCalculatedAmount: number;
  totalVatAmount: number;
  remainderDelta: number;
  lines: GeneratedInvoiceLine[];
}

export function executeExactMatchResolver(
  orderId: string,
  totalAmount: number,
  categories: SanitizedCategory[]
): ExactMatchResult {
  const lines: GeneratedInvoiceLine[] = [];
  let cumulativeSum = 0;
  let totalVat = 0;

  categories.forEach((cat, index) => {
    const isLast = index === categories.length - 1;
    // Calculate target amount for this category based on percentage
    let targetCategorySum = (totalAmount * cat.targetPercent) / 100;

    // Determine reasonable item count & unit price within min-max bounds
    const avgPrice = Math.min(
      cat.maxPrice,
      Math.max(cat.minPrice, (cat.minPrice + cat.maxPrice) / 2)
    );

    let qty = Math.max(1, Math.round(targetCategorySum / (avgPrice || 1)));
    let unitPrice = Number((targetCategorySum / qty).toFixed(2));

    // Enforce bounds if possible
    if (unitPrice < cat.minPrice && cat.minPrice > 0) {
      unitPrice = cat.minPrice;
      qty = Math.max(1, Math.floor(targetCategorySum / unitPrice));
    } else if (unitPrice > cat.maxPrice && cat.maxPrice > 0) {
      unitPrice = cat.maxPrice;
      qty = Math.max(1, Math.ceil(targetCategorySum / unitPrice));
    }

    let subtotal = Number((qty * unitPrice).toFixed(2));

    // Last category absorbs any floating point rounding difference to match exact total
    if (isLast) {
      const currentTotalWithoutLast = cumulativeSum;
      subtotal = Number((totalAmount - currentTotalWithoutLast).toFixed(2));
      unitPrice = Number((subtotal / qty).toFixed(2));
    }

    const vatAmount = Number((subtotal * (cat.vatRate / 100)).toFixed(2));
    const totalWithVat = Number((subtotal + vatAmount).toFixed(2));

    cumulativeSum += subtotal;
    totalVat += vatAmount;

    lines.push({
      id: `line_${index + 1}_${cat.id}`,
      categoryName: cat.name,
      quantity: qty,
      unitPrice,
      subtotal,
      vatRate: cat.vatRate,
      vatAmount,
      totalWithVat,
    });
  });

  const roundedCumulative = Number(cumulativeSum.toFixed(2));
  const roundedTotal = Number(totalAmount.toFixed(2));
  const delta = Number((roundedCumulative - roundedTotal).toFixed(2));

  return {
    orderId,
    totalOriginalAmount: roundedTotal,
    totalCalculatedAmount: roundedCumulative,
    totalVatAmount: Number(totalVat.toFixed(2)),
    remainderDelta: delta,
    lines,
  };
}
