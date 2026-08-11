import {
  ShoppingBag,
  Receipt,
  Scale,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { SystemHealth } from "@/components/dashboard/system-health";
import { Button } from "@/components/ui/button";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Top Banner / Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/30 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-400/30 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> E-Ticaret KDV Ara Yazılımı
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            IdeaSoft ➔ Dopigo Fatura Dengeleyici
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            IdeaSoft siparişlerini matematiksel exact-match algoritmasıyla işleyerek KDV limitlerini optimize eder ve Dopigo API&apos;ye güvenle iletir.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Senkronize Et
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Bekleyen IdeaSoft Siparişleri"
          value="42 Adet"
          subtitle="Toplam ₺184,250.00 tutarında"
          change="+8 sipariş"
          changeType="positive"
          icon={ShoppingBag}
          iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
        />
        <StatCard
          title="Dengelenen Faturalar"
          value="128 Adet"
          subtitle="Dopigo API'ye başarıyla iletildi"
          change="%98.4 Başarı"
          changeType="positive"
          icon={Receipt}
          iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
        />
        <StatCard
          title="KDV Tasarruf / Denge"
          value="₺12,480.00"
          subtitle="Exact-match algoritma farkı"
          change="Optimaye Uygun"
          changeType="positive"
          icon={Scale}
          iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
        />
        <StatCard
          title="Ortalama KDV Oranı"
          value="%18.2"
          subtitle="Hedef KDV aralığı: %18 - %20"
          change="Limit Dahilinde"
          changeType="neutral"
          icon={Sparkles}
          iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
        />
      </div>

      {/* Main Widgets Area: Recent Orders & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrders />
        <SystemHealth />
      </div>
    </div>
  );
}
