"use client";

import React, { useState } from "react";
import {
  Sliders,
  Plus,
  Trash2,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Percent,
  Receipt,
  Scale,
  Send,
  Zap,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderItem } from "./master-order-list";
import { ExactMatchResult } from "@/services/balancer";
import { Toast } from "@/components/ui/toast";

interface CategoryInputRow {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  targetPercent: number;
  vatRate: number;
}

interface RangeResolverDashboardProps {
  selectedOrder: OrderItem | null;
}

export function RangeResolverDashboard({
  selectedOrder,
}: RangeResolverDashboardProps) {
  const [categories, setCategories] = useState<CategoryInputRow[]>([
    {
      id: "cat_1",
      name: "Elektronik Aksesuar",
      minPrice: 100,
      maxPrice: 800,
      targetPercent: 50,
      vatRate: 20,
    },
    {
      id: "cat_2",
      name: "Giyim & Tekstil",
      minPrice: 50,
      maxPrice: 400,
      targetPercent: 30,
      vatRate: 10,
    },
    {
      id: "cat_3",
      name: "Ev & Yaşam Gereçleri",
      minPrice: 30,
      maxPrice: 200,
      targetPercent: 20,
      vatRate: 8,
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [calculationResult, setCalculationResult] =
    useState<ExactMatchResult | null>(null);
  const [toastInfo, setToastInfo] = useState<{
    title: string;
    description: string;
    type: "success" | "error";
  } | null>(null);

  // Overarching Mathematical Validation Rule: Target percentages must equal 100%
  const totalTargetPercent = categories.reduce(
    (sum, cat) => sum + (Number(cat.targetPercent) || 0),
    0
  );
  const isValidPercentSum = Math.abs(totalTargetPercent - 100) < 0.01;

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      {
        id: `cat_${Date.now()}`,
        name: `Kategori ${categories.length + 1}`,
        minPrice: 50,
        maxPrice: 500,
        targetPercent: 0,
        vatRate: 20,
      },
    ]);
  };

  const handleRemoveCategory = (id: string) => {
    if (categories.length <= 1) return;
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleCategoryChange = (
    id: string,
    field: keyof CategoryInputRow,
    value: any
  ) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === id) {
          return { ...cat, [field]: value };
        }
        return cat;
      })
    );
  };

  const handleRunRangeResolver = async () => {
    if (!selectedOrder) {
      setToastInfo({
        title: "Sipariş Seçilmedi",
        description: "Lütfen sol listeden dengelemek istediğiniz siparişi seçin.",
        type: "error",
      });
      return;
    }

    if (!isValidPercentSum) {
      setToastInfo({
        title: "Matematiksel Kural İhlali",
        description: `Kategori hedef yüzdeleri toplamı %100 olmalıdır. (Şu anki: %${totalTargetPercent})`,
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    setCalculationResult(null);

    try {
      const response = await fetch("/api/invoice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.orderNumber,
          customerTckn: selectedOrder.tckn,
          totalAmount: selectedOrder.totalAmount,
          categories: categories.map((c) => ({
            id: c.id,
            name: c.name,
            minPrice: Number(c.minPrice),
            maxPrice: Number(c.maxPrice),
            targetPercent: Number(c.targetPercent),
            vatRate: Number(c.vatRate),
          })),
        }),
      });

      const json = await response.json();
      setIsProcessing(false);

      if (json.success && json.data) {
        setCalculationResult(json.data.matchResult);
        setToastInfo({
          title: "Exact-Match Fatura Üretildi!",
          description: `INV-${selectedOrder.orderNumber} faturası başarıyla Dopigo API'ye iletildi.`,
          type: "success",
        });
      } else {
        setToastInfo({
          title: "İşlem Başarısız",
          description: json.error || "Fatura üretilemedi.",
          type: "error",
        });
      }
    } catch (err) {
      setIsProcessing(false);
      setToastInfo({
        title: "Sunucu Hatası",
        description: "Bağlantı sırasında beklenmeyen bir hata oluştu.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Percentage Validation Bar Header */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden p-6 bg-slate-900 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Exact-Match Range Resolver
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              {selectedOrder
                ? `Sipariş: ${selectedOrder.orderNumber}`
                : "Sipariş Seçilmedi"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Müşteri: {selectedOrder?.customerName || "—"} | TCKN:{" "}
              {selectedOrder?.tckn || "—"}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400">İşlenecek Sipariş Tutarı</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ₺
              {selectedOrder
                ? selectedOrder.totalAmount.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })
                : "0.00"}
            </div>
          </div>
        </div>

        {/* 100% Target Percentage Rule Status Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-slate-300">
              Hedef Yüzde Toplamı:
            </span>
            <span
              className={`font-bold font-mono px-2 py-0.5 rounded-lg ${
                isValidPercentSum
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}
            >
              %{totalTargetPercent.toFixed(1)} / %100
            </span>
          </div>

          {isValidPercentSum ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Kural Geçerli (%100 Tamam)
            </span>
          ) : (
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> Toplam %100 Olmalıdır!
            </span>
          )}
        </div>
      </Card>

      {/* Dynamic Category Builder */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-500" />
              Dinamik Fatura KDV Kategorileri
            </CardTitle>
            <CardDescription>
              Bu fatura için serbest min-max fiyat ve hedef yüzdeleri tanımlayın
            </CardDescription>
          </div>
          <Button
            onClick={handleAddCategory}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs rounded-xl"
          >
            <Plus className="h-3.5 w-3.5" /> Kategori Ekle
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Category Name */}
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Kategori Adı #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) =>
                      handleCategoryChange(cat.id, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Min Price */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Min Price (₺)
                  </label>
                  <input
                    type="number"
                    value={cat.minPrice}
                    onChange={(e) =>
                      handleCategoryChange(
                        cat.id,
                        "minPrice",
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Max Price */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Max Price (₺)
                  </label>
                  <input
                    type="number"
                    value={cat.maxPrice}
                    onChange={(e) =>
                      handleCategoryChange(
                        cat.id,
                        "maxPrice",
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Target % */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Hedef (%)
                  </label>
                  <input
                    type="number"
                    value={cat.targetPercent}
                    onChange={(e) =>
                      handleCategoryChange(
                        cat.id,
                        "targetPercent",
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* VAT Rate */}
                <div className="sm:col-span-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    KDV
                  </label>
                  <select
                    value={cat.vatRate}
                    onChange={(e) =>
                      handleCategoryChange(
                        cat.id,
                        "vatRate",
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-2 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={8}>%8</option>
                    <option value={10}>%10</option>
                    <option value={20}>%20</option>
                  </select>
                </div>

                {/* Remove Category */}
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    onClick={() => handleRemoveCategory(cat.id)}
                    disabled={categories.length <= 1}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Action Trigger Button */}
          <div className="pt-2">
            <Button
              onClick={handleRunRangeResolver}
              disabled={isProcessing || !isValidPercentSum || !selectedOrder}
              variant="apple"
              size="lg"
              className="w-full gap-2 shadow-blue-500/25 shadow-xl font-bold py-4 text-base"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Exact-Match Algoritması Çalışıyor...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  Exact-Match Dengelemeyi Çalıştır ve Dopigo&apos;ya İlet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Invoice Result Breakdown */}
      {calculationResult && (
        <Card className="rounded-3xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/20 shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="h-5 w-5" />
              <span>Matematiksel Eşleşme Başarıyla Tamamlandı</span>
            </div>
            <Badge variant="success" className="font-mono">
              Fatura Tutar Tamam (%100)
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="uppercase text-slate-400 bg-slate-900/50 rounded-xl">
                <tr>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Adet</th>
                  <th className="p-3">Birim Fiyat</th>
                  <th className="p-3">Ara Toplam</th>
                  <th className="p-3">KDV Oranı</th>
                  <th className="p-3">KDV Tutarı</th>
                  <th className="p-3 text-right">KDV Dahil Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {calculationResult.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="p-3 font-sans font-medium text-slate-200">
                      {line.categoryName}
                    </td>
                    <td className="p-3 text-slate-300">{line.quantity}</td>
                    <td className="p-3 text-slate-300">₺{line.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-slate-300">₺{line.subtotal.toFixed(2)}</td>
                    <td className="p-3 text-blue-400">%{line.vatRate}</td>
                    <td className="p-3 text-emerald-400">₺{line.vatAmount.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      ₺{line.totalWithVat.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row justify-between text-xs text-slate-300">
            <div>
              Orijinal Sipariş Tutarı:{" "}
              <span className="font-bold font-mono text-emerald-400">
                ₺{calculationResult.totalOriginalAmount.toFixed(2)}
              </span>
            </div>
            <div>
              Hesaplanan Toplam KDV:{" "}
              <span className="font-bold font-mono text-emerald-400">
                ₺{calculationResult.totalVatAmount.toFixed(2)}
              </span>
            </div>
            <div>
              Kuruş Hassasiyet Farkı (Delta):{" "}
              <span className="font-bold font-mono text-blue-400">
                ₺{calculationResult.remainderDelta.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      )}

      {toastInfo && (
        <Toast
          title={toastInfo.title}
          description={toastInfo.description}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}
    </div>
  );
}
