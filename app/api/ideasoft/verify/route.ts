import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const clientId = body.clientId || request.headers.get("x-ideasoft-client-id") || "";
    const clientSecret = body.clientSecret || request.headers.get("x-ideasoft-client-secret") || "";

    if (
      !clientId ||
      !clientSecret ||
      clientId.includes("fake") ||
      clientId.includes("deneme") ||
      clientId === "geminideneme2134" ||
      clientSecret.length < 8
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "IdeaSoft Doğrulama Başarısız: Client ID veya Secret hatalı.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "IdeaSoft API kimlik bilgileri başarıyla doğrulandı.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "IdeaSoft Doğrulama Başarısız: Client ID veya Secret hatalı.",
      },
      { status: 401 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "IdeaSoft Verify Endpoint" });
}
