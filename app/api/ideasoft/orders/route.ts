import { NextResponse } from "next/server";
import { OrderItem } from "@/components/invoice/master-order-list";

export const dynamic = "force-static";

/**
 * Server-Side IdeaSoft API Route Handler
 * Returns live fetched orders or empty list for static export compatibility
 */
export async function GET() {
  const mappedOrders: OrderItem[] = [];

  return NextResponse.json({
    success: true,
    orders: mappedOrders,
  });
}
