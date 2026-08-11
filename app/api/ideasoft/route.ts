import { NextResponse } from "next/server";
import { fetchIdeaSoftOrders } from "@/services/ideasoft";

export async function GET() {
  try {
    const orders = await fetchIdeaSoftOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "IdeaSoft siparişleri alınamadı." },
      { status: 500 }
    );
  }
}
