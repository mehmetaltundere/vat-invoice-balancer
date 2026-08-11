"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderItem } from "@/components/invoice/master-order-list";

interface RecentOrdersProps {
  orders?: OrderItem[];
}

export function RecentOrders({ orders = [] }: RecentOrdersProps) {
  const displayOrders = orders.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#0066CC]" />
            Son IdeaSoft Siparişleri
          </CardTitle>
        </div>
        <Link
          href="/invoice"
          className="text-xs font-semibold text-[#0066CC] hover:underline flex items-center gap-1 cursor-pointer"
        >
          Tümünü Gör <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="uppercase text-gray-500 bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-3 font-semibold">Sipariş No</th>
              <th className="p-3 font-semibold">Müşteri</th>
              <th className="p-3 font-semibold">TCKN</th>
              <th className="p-3 font-semibold text-right">Tutar</th>
              <th className="p-3 font-semibold text-center">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Henüz sipariş bulunmuyor.
                </td>
              </tr>
            ) : (
              displayOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="p-3 font-mono font-bold text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {order.customerName}
                  </td>
                  <td className="p-3 font-mono text-gray-500">
                    {order.tckn || "11111111111"}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-gray-900">
                    ₺{order.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    {order.status === "BALANCED" ? (
                      <Badge variant="success" className="text-[10px]">
                        Faturalandırıldı
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">
                        Fatura Bekliyor
                      </Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
