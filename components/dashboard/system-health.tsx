import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import Link from "next/link";

export function SystemHealth() {
  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
            <Cpu className="h-4 w-4 text-[#0A84FF]" />
            Algoritma & API Durumu
          </CardTitle>
          <CardDescription>
            Matematiksel Exact-Match KDV Dengeleme Motoru
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Algoritma Modu</span>
              <span className="font-bold text-[#0A84FF] bg-[#0A84FF]/15 px-2.5 py-0.5 rounded-full border border-[#0A84FF]/30">
                Exact-Match Range
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Hedef KDV Oranı</span>
              <span className="font-mono font-bold text-white">%18.5 Ort.</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Otomatik Tetikleme</span>
              <span className="text-[#30D158] font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Aktif
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Entegrasyon Gecikmeleri
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-300">IdeaSoft Webhook</span>
                <span className="font-mono text-[#30D158] font-bold">12ms</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-300">Dopigo REST API</span>
                <span className="font-mono text-[#30D158] font-bold">45ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-6 pt-0">
        <Link href="/invoice">
          <Button variant="apple" className="w-full gap-2 font-bold py-3 text-xs">
            <Play className="h-4 w-4 fill-current" />
            Fatura Kesme Motorunu Çalıştır
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
