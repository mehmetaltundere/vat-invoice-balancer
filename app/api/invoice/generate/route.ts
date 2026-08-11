import { NextResponse } from "next/server";
import { executeExactMatchResolver } from "@/services/balancer";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const result = executeExactMatchResolver(
      body.orderId || "IS-8801",
      body.totalAmount || 2700.0,
      body.categories || []
    );

    return NextResponse.json({
      success: true,
      data: {
        orderId: body.orderId,
        matchResult: result,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Fatura üretilemedi.",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Invoice Generate Endpoint" });
}
