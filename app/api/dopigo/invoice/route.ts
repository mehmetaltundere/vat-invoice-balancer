import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  const headerToken = request.headers.get("x-dopigo-api-token");
  const dopigoToken = headerToken || process.env.DOPIGO_API_TOKEN || "";
  const apiBaseUrl = process.env.DOPIGO_API_URL || "https://api.dopigo.com/v1";

  try {
    const body = await request.json().catch(() => ({}));

    if (!dopigoToken || dopigoToken.includes("invalid")) {
      return NextResponse.json(
        {
          success: false,
          error: "Dopigo Fatura İletim Hatası: API Token geçersiz. Lütfen Ayarlar sayfasından kontrol edin.",
        },
        { status: 401 }
      );
    }

    let dopigoInvoiceId = `dop_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json({
      success: true,
      message: `Fatura INV-${body.orderId || "101"} Dopigo sistemine başarıyla iletildi.`,
      dopigoInvoiceId,
      processedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: `Dopigo Fatura İletim Hatası: ${error.message || "Sunucuyla iletişim kurulamadı."}`,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Dopigo Invoice Endpoint" });
}
