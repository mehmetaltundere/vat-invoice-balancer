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
  Activity,
  Sliders,
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
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Algoritma & API Durumu
          </CardTitle>
          <CardDescription>
            Matematiksel Exact-Match KDV Dengeleme Motoru
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Algoritma Modu</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                Exact-Match Range
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Hedef KDV Oranı</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">%18.5 Ort.</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Otomatik Tetikleme</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Aktif
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Entegrasyon Gecikmeleri
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">IdeaSoft Webhook</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">12ms</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Dopigo REST API</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">45ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-6 pt-0">
        <Link href="/fatura-kes">
          <Button className="w-full gap-2 shadow-indigo-500/20 shadow-lg">
            <Play className="h-4 w-4 fill-current" />
            Fatura Kesme Motorunu Çalıştır
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
