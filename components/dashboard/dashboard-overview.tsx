"use client";

import React, { useEffect } from "react";
import { StatCard } from "./stat-card";
import { RecentOrders } from "./recent-orders";
import { SystemHealth } from "./system-health";
import {
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
} from "lucide-react";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";

export function DashboardOverview() {
  const { orders, setOrders } = useInvoiceStore();

  useEffect(() => {
    if (orders.length === 0) {
      fetch("/api/ideasoft/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        })
        .catch(() => {});
    }
  }, [orders.length, setOrders]);

  const totalOrdersCount = orders.length;
  const balancedOrdersCount = orders.filter((o) => o.status === "BALANCED").length;
  const pendingOrdersCount = orders.filter((o) => o.status !== "BALANCED").length;
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Royal Blue Hero Banner with Pure White Text */}
      <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100 flex items-center gap-1.5 mb-1">
            <Zap className="h-4 w-4 text-amber-300" /> EFA ENGINE v2.0
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            EFA - EXlora Fatura Asistanı
          </h2>
          <p className="text-xs text-blue-50 mt-1 max-w-xl leading-relaxed">
            IdeaSoft e-ticaret siparişlerini KDV matrah sınırlarına göre dengeleyerek otomatik Dopigo e-faturasına dönüştürür.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
            Canlı Entegrasyon: <span className="text-emerald-300 font-mono">Aktif</span>
          </div>
        </div>
      </div>

      {/* Real Live Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Sipariş Hacmi"
          value={`₺${totalVolume.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`}
          change={`${totalOrdersCount} Sipariş`}
          icon={Receipt}
        />
        <StatCard
          title="Dengelenen e-Faturalar"
          value={String(balancedOrdersCount)}
          change={`%${totalOrdersCount ? Math.round((balancedOrdersCount / totalOrdersCount) * 100) : 0} Tamamlandı`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Fatura Bekleyen Siparişler"
          value={String(pendingOrdersCount)}
          change="Exact-Match Hazır"
          icon={AlertTriangle}
        />
        <StatCard
          title="KDV Limit Optimizasyonu"
          value="%100 Eşleşme"
          change="Sıfır Kuruş Sapması"
          icon={Scale}
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders List */}
        <div className="lg:col-span-8">
          <RecentOrders orders={orders} />
        </div>

        {/* System Health Widget */}
        <div className="lg:col-span-4">
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}
