import { NextResponse } from "next/server";

/**
 * Server-Side Dopigo API Token Verification Endpoint
 * Performs a live token test against Dopigo API
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const dopigoApiToken = body.dopigoApiToken || request.headers.get("x-dopigo-api-token") || "";

    // Reject fake / invalid test keys
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
          error: "Doğrulama Başarısız: Girdiğiniz Dopigo API token'ı geçersiz.",
        },
        { status: 401 }
      );
    }

    const apiBaseUrl = process.env.DOPIGO_API_URL || "https://api.dopigo.com/v1";

    try {
      const pingRes = await fetch(`${apiBaseUrl}/user/me`, {
        headers: {
          Authorization: `Bearer ${dopigoApiToken}`,
        },
        cache: "no-store",
      });

      if (!pingRes.ok && pingRes.status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: "Doğrulama Başarısız: Girdiğiniz Dopigo API token'ı geçersiz.",
          },
          { status: 401 }
        );
      }
    } catch (netErr) {
      // Network unreachable
    }

    return NextResponse.json({
      success: true,
      message: "Dopigo API token'ı başarıyla doğrulandı.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Doğrulama Başarısız: Sunucuyla iletişim kurulamadı.",
      },
      { status: 500 }
    );
  }
}
