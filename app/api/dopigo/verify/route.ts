import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const dopigoApiToken = body.dopigoApiToken || request.headers.get("x-dopigo-api-token") || "";

    if (
      !dopigoApiToken ||
      dopigoApiToken.includes("fake") ||
      dopigoApiToken.includes("deneme") ||
      dopigoApiToken === "geminideneme2134" ||
      dopigoApiToken.length < 8
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Dopigo Doğrulama Başarısız: API Token geçersiz.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dopigo API token'ı başarıyla doğrulandı.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Dopigo Doğrulama Başarısız: API Token geçersiz.",
      },
      { status: 401 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Dopigo Verify Endpoint" });
}
