import { Receipt, Play, Sliders, ArrowRightLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FaturaKesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Fatura Kes (Invoice Generator)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            IdeaSoft siparişlerini matematiksel exact-match algoritmasıyla eşleştirerek Dopigo faturalarını üretin.
          </p>
        </div>
        <Badge variant="default" className="w-fit text-xs px-3 py-1">
          Görev 2 Hazırlığı
        </Badge>
      </div>

      <Card className="border-dashed border-2 border-slate-300 dark:border-slate-800 p-12 text-center">
        <CardContent className="space-y-4 pt-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <ArrowRightLeft className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Fatura Kesme Modülü Bileşeni
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Bu alanda IdeaSoft API sipariş seçici, matematiksel döküm ekranı ve Dopigo Fatura Kesme butonu yer alacaktır.
          </p>
          <div className="pt-2">
            <Button variant="outline" className="gap-2">
              <Sliders className="h-4 w-4" /> Algoritma Parametrelerini Gör
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
