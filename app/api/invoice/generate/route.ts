import { NextResponse } from "next/server";
import { validateInvoicePayload } from "@/lib/security/validation";
import { executeExactMatchResolver } from "@/services/balancer";
import { sendInvoiceToDopigo } from "@/services/dopigo";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // 1. Cybersecurity validation & sanitization
    const validation = validateInvoicePayload(rawBody);

    if (!validation.isValid || !validation.sanitized) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { orderId, totalAmount, categories, customerTckn } =
      validation.sanitized;

    // 2. Execute Exact-Match Range Resolver Math
    const matchResult = executeExactMatchResolver(
      orderId,
      totalAmount,
      categories
    );

    // 3. Send invoice to Dopigo API (Server-Side)
    const dopigoResponse = await sendInvoiceToDopigo({
      invoiceNumber: `INV-${orderId}`,
      ideaSoftOrderId: orderId,
      totalAmount: matchResult.totalCalculatedAmount,
      appliedVatRate: categories[0]?.vatRate || 20,
      customerTaxId: customerTckn,
      status: "SENT",
    });

    return NextResponse.json({
      success: true,
      data: {
        matchResult,
        dopigoReference: dopigoResponse.id,
      },
    });
  } catch (error: any) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Fatura üretilirken bir sunucu hatası oluştu.",
      },
      { status: 500 }
    );
  }
}
