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
      badgeVariant: "secondary" as const,
      time: "10 dk önce",
    },
    {
      id: "IS-2026-8802",
      customer: "Mehmet Demir",
      amount: "₺8,200.50",
      vat: "₺1,640.10 (%20)",
      status: "Dengelenmeyi Bekliyor",
      badgeVariant: "secondary" as const,
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
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            IdeaSoft Son Sipariş Akışı
          </CardTitle>
          <CardDescription>
            IdeaSoft API üzerinden çekilen son siparişler ve KDV durumu
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          Tümünü Gör
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 rounded-lg">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-l-lg">Sipariş Kodu</th>
                <th className="px-4 py-3 font-semibold">Müşteri</th>
                <th className="px-4 py-3 font-semibold">Tutar</th>
                <th className="px-4 py-3 font-semibold">KDV</th>
                <th className="px-4 py-3 font-semibold">Durum</th>
                <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sampleOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {order.id}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {order.amount}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                    {order.vat}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={order.badgeVariant} className="text-xs font-normal">
                      {order.badgeVariant === "success" ? (
                        <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1 text-amber-500" />
                      )}
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-slate-400">
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
