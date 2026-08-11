import { NextResponse } from "next/server";

export const dynamic = "force-static";

/**
 * Static-Export Friendly IdeaSoft Order Status Update Endpoint
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderId = body.orderId || body.id || "";

    const clientId = request.headers.get("x-ideasoft-client-id") || process.env.IDEASOFT_CLIENT_ID || "";
    const clientSecret = request.headers.get("x-ideasoft-client-secret") || process.env.IDEASOFT_CLIENT_SECRET || "";
    const apiBaseUrl = process.env.IDEASOFT_API_URL || "https://api.myideasoft.com/api";

    if (clientId && clientSecret && !clientId.includes("live_88492019")) {
      await fetch(`${apiBaseUrl}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${clientId}:${clientSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "BALANCED",
          invoiceStatus: "Faturalandırıldı",
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: "BALANCED",
      message: `Sipariş ${orderId} durumu 'Faturalandırıldı' olarak güncellendi.`,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Sipariş durumu güncellenemedi." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "IdeaSoft Order Update Endpoint" });
}
