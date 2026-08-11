import { NextResponse } from "next/server";
import { OrderItem } from "@/components/invoice/master-order-list";

export const dynamic = "force-static";

export async function GET() {
  const mappedOrders: OrderItem[] = [
    {
      id: "ord_1",
      orderNumber: "IS-2026-8801",
      customerName: "Ahmet Yılmaz",
      tckn: "11111111111",
      totalAmount: 2700.0,
      date: "10 dk önce",
      status: "PENDING",
    },
    {
      id: "ord_2",
      orderNumber: "IS-2026-8802",
      customerName: "Mehmet Demir",
      tckn: "",
      totalAmount: 8200.5,
      date: "42 dk önce",
      status: "PENDING",
    },
    {
      id: "ord_3",
      orderNumber: "IS-2026-8803",
      customerName: "Ayşe Kaya (Kurumsal)",
      tckn: "99887766551",
      totalAmount: 23100.0,
      date: "2 saat önce",
      status: "BALANCED",
    },
    {
      id: "ord_4",
      orderNumber: "IS-2026-8804",
      customerName: "Zeynep Arslan",
      tckn: "11111111111",
      totalAmount: 5400.0,
      date: "3 saat önce",
      status: "PENDING",
    },
  ];

  return NextResponse.json({
    success: true,
    orders: mappedOrders,
  });
}
