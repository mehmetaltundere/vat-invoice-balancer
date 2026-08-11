import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShoppingBag, CheckCircle, Clock } from "lucide-react";

export function RecentOrders() {
  const sampleOrders = [
    {
      id: "IS-2026-8801",
      customer: "Ahmet Yılmaz",
      amount: "₺14,500.00",
      vat: "₺2,900.00 (%20)",
      status: "Dengelenmeyi Bekliyor",
      badgeVariant: "warning" as const,
      time: "10 dk önce",
    },
    {
      id: "IS-2026-8802",
      customer: "Mehmet Demir",
      amount: "₺8,200.50",
      vat: "₺1,640.10 (%20)",
      status: "Dengelenmeyi Bekliyor",
      badgeVariant: "warning" as const,
      time: "42 dk önce",
    },
    {
      id: "IS-2026-8803",
      customer: "Ayşe Kaya",
      amount: "₺23,100.00",
      vat: "₺4,620.00 (%20)",
      status: "Dengelendi & Dopigo'da",
      badgeVariant: "success" as const,
      time: "2 saat önce",
    },
    {
      id: "IS-2026-8804",
      customer: "Zeynep Arslan",
      amount: "₺5,400.00",
      vat: "₺540.00 (%10)",
      status: "Dengelendi & Dopigo'da",
      badgeVariant: "success" as const,
      time: "3 saat önce",
    },
  ];

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#0066CC]" />
            IdeaSoft Son Sipariş Akışı
          </CardTitle>
          <CardDescription>
            IdeaSoft API üzerinden çekilen son siparişler ve KDV durumu
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1 text-xs rounded-lg">
          Tümünü Gör
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="uppercase bg-gray-50 text-gray-500 rounded-lg">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-l-lg">Sipariş Kodu</th>
                <th className="px-4 py-3 font-semibold">Müşteri</th>
                <th className="px-4 py-3 font-semibold">Tutar</th>
                <th className="px-4 py-3 font-semibold">KDV</th>
                <th className="px-4 py-3 font-semibold">Durum</th>
                <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sampleOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-100 transition-colors cursor-pointer font-medium"
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-[#0066CC]">
                    {order.id}
                  </td>
                  <td className="px-4 py-3.5 text-gray-900 font-semibold">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-gray-800">
                    {order.amount}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {order.vat}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={order.badgeVariant} className="text-[11px]">
                      {order.badgeVariant === "success" ? (
                        <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1 text-amber-600" />
                      )}
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-400">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
