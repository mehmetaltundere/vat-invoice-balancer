import { NextResponse } from "next/server";
import { sendInvoiceToDopigo } from "@/services/dopigo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sendInvoiceToDopigo(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Dopigo faturası gönderilemedi." },
      { status: 500 }
    );
  }
}
