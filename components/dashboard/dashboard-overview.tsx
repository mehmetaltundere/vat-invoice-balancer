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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2c2c2e]/70 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#0A84FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#0A84FF]/20 text-[#0A84FF] text-[11px] font-bold px-3 py-1 rounded-full border border-[#0A84FF]/30 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> E-Ticaret KDV Ara Yazılımı
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            IdeaSoft ➔ Dopigo Fatura Dengeleyici
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
            IdeaSoft siparişlerini matematiksel exact-match algoritmasıyla işleyerek KDV limitlerini optimize eder ve Dopigo API&apos;ye güvenle iletir.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-white/15 bg-white/10 hover:bg-white/20 text-white rounded-2xl"
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
          iconColor="text-[#0A84FF] bg-[#0A84FF]/15 border border-[#0A84FF]/30"
        />
        <StatCard
          title="Dengelenen Faturalar"
          value="128 Adet"
          subtitle="Dopigo API'ye başarıyla iletildi"
          change="%98.4 Başarı"
          changeType="positive"
          icon={Receipt}
          iconColor="text-[#30D158] bg-[#30D158]/15 border border-[#30D158]/30"
        />
        <StatCard
          title="KDV Tasarruf / Denge"
          value="₺12,480.00"
          subtitle="Exact-match algoritma farkı"
          change="Optümaya Uygun"
          changeType="positive"
          icon={Scale}
          iconColor="text-[#FF9F0A] bg-[#FF9F0A]/15 border border-[#FF9F0A]/30"
        />
        <StatCard
          title="Ortalama KDV Oranı"
          value="%18.2"
          subtitle="Hedef KDV aralığı: %18 - %20"
          change="Limit Dahilinde"
          changeType="neutral"
          icon={Sparkles}
          iconColor="text-[#BF5AF2] bg-[#BF5AF2]/15 border border-[#BF5AF2]/30"
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
