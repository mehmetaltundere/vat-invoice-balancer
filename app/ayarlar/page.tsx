import { Settings, SlidersHorizontal, Percent, Database, Key } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AyarlarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Kategori & KDV Ayarları
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            API anahtarları, KDV oran eşiklikleri ve kategori eşleştirme kural ayarları.
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-xs px-3 py-1">
          Sistem Ayarları
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-500" />
              IdeaSoft API Yapılandırması
            </CardTitle>
            <CardDescription>Sipariş çekme API anahtarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between">
              <span>Client ID</span>
              <span className="font-mono text-xs text-slate-800 dark:text-slate-200">ideasoft_live_******</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between">
              <span>Webhook Durumu</span>
              <Badge variant="success">Etkin</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="h-4 w-4 text-indigo-500" />
              KDV Limit Eşikleri
            </CardTitle>
            <CardDescription>Exact-match algoritma hedef toleransları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between">
              <span>Hedef KDV Üst Limiti</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">%20</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between">
              <span>Tolerans Aralığı</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">± %1.5</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
