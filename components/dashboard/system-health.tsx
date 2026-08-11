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
          <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2 text-gray-900">
            <Cpu className="h-4 w-4 text-[#0066CC]" />
            Algoritma & API Durumu
          </CardTitle>
          <CardDescription>
            Matematiksel Exact-Match KDV Dengeleme Motoru
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Algoritma Modu</span>
              <span className="font-semibold text-[#0066CC] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Exact-Match Range
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Hedef KDV Oranı</span>
              <span className="font-mono font-semibold text-gray-900">%18.5 Ort.</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Otomatik Tetikleme</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Aktif
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Entegrasyon Gecikmeleri
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-gray-600">IdeaSoft Webhook</span>
                <span className="font-mono text-emerald-600 font-semibold">12ms</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-gray-600">Dopigo REST API</span>
                <span className="font-mono text-emerald-600 font-semibold">45ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-6 pt-0">
        <Link href="/invoice">
          <Button variant="default" className="w-full gap-2 font-semibold py-3 text-xs">
            <Play className="h-4 w-4 fill-current" />
            Fatura Kesme Motorunu Çalıştır
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
