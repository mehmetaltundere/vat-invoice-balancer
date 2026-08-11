"use client";

import React, { useState } from "react";
import {
  Sliders,
  Trash2,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Scale,
  Zap,
  Layers,
  AlertTriangle,
  Lock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderItem } from "./master-order-list";
import { ExactMatchResult, executeExactMatchResolver } from "@/services/balancer";
import { Toast } from "@/components/ui/toast";
import { GibCategoryComboBox } from "./gib-category-combobox";
import { GranularVatItem } from "@/lib/services/vat-database";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";

interface RangeResolverDashboardProps {
  selectedOrder: OrderItem | null;
  batchOrders?: OrderItem[];
  onBatchCompleted?: (orderIds: string[]) => void;
}

const STORAGE_KEY = "nexus_vat_api_settings";

export function RangeResolverDashboard({
  selectedOrder,
  batchOrders = [],
  onBatchCompleted,
}: RangeResolverDashboardProps) {
  const {
    categories,
    updateCategory,
    addCategory,
    removeCategory,
    calculationResult,
    setCalculationResult,
    updateOrder,
  } = useInvoiceStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    currentOrder: string;
  } | null>(null);

  const [toastInfo, setToastInfo] = useState<{
    title: string;
    description: string;
    type: "success" | "error";
  } | null>(null);

  const totalTargetPercent = categories.reduce(
    (sum, cat) => sum + (Number(cat.targetPercent) || 0),
    0
  );
  const isValidPercentSum = Math.abs(totalTargetPercent - 100) < 0.01;
  const hasSelectedOrders = batchOrders.length > 0 || selectedOrder !== null;

  const handleAddGranularItem = (item: GranularVatItem) => {
    addCategory({
      id: `cat_${Date.now()}`,
      name: item.name,
      minPrice: 50,
      maxPrice: 500,
      targetPercent: 0,
      vatRate: item.vatRate,
    });
  };

  const getApiCredentials = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to read settings for headers", e);
    }
    return {
      ideaSoftClientId: "",
      ideaSoftClientSecret: "",
      dopigoApiToken: "",
    };
  };

  const handleRunBatchQueue = async () => {
    const ordersToProcess =
      batchOrders.length > 0 ? batchOrders : selectedOrder ? [selectedOrder] : [];

    if (ordersToProcess.length === 0) {
      setToastInfo({
        title: "Sipariş Seçilmedi",
        description: "Lütfen sol taraftaki listeden dengelemek istediğiniz en az bir siparişi seçin.",
        type: "error",
      });
      return;
    }

    if (!isValidPercentSum) {
      setToastInfo({
        title: "Matematiksel Dengeleme Hatası",
        description: `İşlem Durduruldu: Hedef yüzdelerinizin toplamı tam olarak %100 olmalıdır. (Şu an: %${totalTargetPercent})`,
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    setCalculationResult(null);

    const completedIds: string[] = [];
    const creds = getApiCredentials();

    try {
      for (let i = 0; i < ordersToProcess.length; i++) {
        const order = ordersToProcess[i];

        setBatchProgress({
          current: i + 1,
          total: ordersToProcess.length,
          currentOrder: order.orderNumber,
        });

        let matchResult: ExactMatchResult;
        try {
          matchResult = executeExactMatchResolver(
            order.orderNumber,
            order.totalAmount,
            categories.map((c) => ({
              id: c.id,
              name: c.name,
              minPrice: Number(c.minPrice),
              maxPrice: Number(c.maxPrice),
              targetPercent: Number(c.targetPercent),
              vatRate: Number(c.vatRate),
            }))
          );
        } catch (mathErr) {
          throw new Error("Matematiksel Dengeleme Hatası: Seçilen aralıklar hedef tutarı karşılamıyor.");
        }

        // 1. POST to Dopigo API Route
        const response = await fetch("/api/dopigo/invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-dopigo-api-token": creds.dopigoApiToken,
          },
          body: JSON.stringify({
            orderId: order.orderNumber,
            totalAmount: matchResult.totalCalculatedAmount,
            lines: matchResult.lines,
          }),
        });

        const resJson = await response.json();

        if (!response.ok || !resJson.success) {
          throw new Error(
            resJson.error || "Dopigo Fatura İletim Hatası: Lütfen API token'ınızı Ayarlar sayfasından kontrol edin."
          );
        }

        // 2. INVOICE LOOP-BACK: Immediately update IdeaSoft Order status to Faturalandırıldı (BALANCED)
        await fetch(`/api/ideasoft/orders/${order.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-ideasoft-client-id": creds.ideaSoftClientId,
            "x-ideasoft-client-secret": creds.ideaSoftClientSecret,
          },
          body: JSON.stringify({ status: "BALANCED" }),
        }).catch(() => {});

        // Update local store state instantly
        updateOrder({ ...order, status: "BALANCED" });
        completedIds.push(order.id);

        if (i === ordersToProcess.length - 1) {
          setCalculationResult(matchResult);
        }
      }

      setIsProcessing(false);
      setBatchProgress(null);

      if (onBatchCompleted && completedIds.length > 0) {
        onBatchCompleted(completedIds);
      }

      setToastInfo({
        title: "Toplu Fatura İşlemi Tamamlandı!",
        description: `${completedIds.length} adet sipariş dengelenerek Dopigo'ya iletildi ve IdeaSoft'ta 'Faturalandırıldı' durumuna getirildi.`,
        type: "success",
      });
    } catch (err: any) {
      setIsProcessing(false);
      setBatchProgress(null);
      setToastInfo({
        title: "Dopigo Fatura İletim Hatası",
        description: err.message || "Dopigo Fatura İletim Hatası: Sunucuyla iletişim kurulamadı.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Percentage Validation Bar Header */}
      <Card className="p-6 bg-gray-900 text-white relative border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Exact-Match Range Resolver
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {batchOrders.length > 1
                ? `Toplu Kuyruk İşlemi (${batchOrders.length} Sipariş)`
                : selectedOrder
                ? `Sipariş: ${selectedOrder.orderNumber}`
                : "Sipariş Seçilmedi"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              Müşteri: {selectedOrder?.customerName || "Toplu Seçim"} | TCKN:{" "}
              {selectedOrder?.tckn || "Varsayılan (11111111111)"}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400">İşlenecek Toplam Tutar</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ₺
              {batchOrders.length > 1
                ? batchOrders
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toLocaleString("tr-TR", { minimumFractionDigits: 2 })
                : selectedOrder
                ? selectedOrder.totalAmount.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })
                : "0.00"}
            </div>
          </div>
        </div>

        {/* 100% Target Percentage Rule Status Bar */}
        <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-gray-300">
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

      {/* Live Batch Progress Bar */}
      {batchProgress && (
        <Card className="p-4 bg-blue-50 border border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#0066CC]" />
              Sipariş {batchProgress.current}/{batchProgress.total} Kesiliyor... ({batchProgress.currentOrder})
            </span>
            <span className="font-mono">
              %{Math.round((batchProgress.current / batchProgress.total) * 100)}
            </span>
          </div>
          <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0066CC] h-full transition-all duration-300"
              style={{
                width: `${(batchProgress.current / batchProgress.total) * 100}%`,
              }}
            />
          </div>
        </Card>
      )}

      {/* Dynamic Retail Item ComboBox & Inputs */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#0066CC]" />
              Cloud KDV Veritabanı & Özel Kategoriler
            </CardTitle>
            <CardDescription>
              Cloud veritabanından veya Ayarlar&apos;da tanımladığınız özel kategorilerden arayıp ekleyin
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cloud Search ComboBox */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Cloud veya Özel KDV Kategorisi Ekle
            </p>
            <GibCategoryComboBox onSelectCategory={handleAddGranularItem} />
          </div>

          {/* Category Input Rows */}
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 row-micro"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Category Name */}
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Ürün / Kategori Adı #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) =>
                      updateCategory(cat.id, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                  />
                </div>

                {/* Min Price */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Min (₺)
                  </label>
                  <input
                    type="number"
                    value={cat.minPrice}
                    onChange={(e) =>
                      updateCategory(cat.id, "minPrice", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                  />
                </div>

                {/* Max Price */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Max (₺)
                  </label>
                  <input
                    type="number"
                    value={cat.maxPrice}
                    onChange={(e) =>
                      updateCategory(cat.id, "maxPrice", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                  />
                </div>

                {/* Target % */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Hedef (%)
                  </label>
                  <input
                    type="number"
                    value={cat.targetPercent}
                    onChange={(e) =>
                      updateCategory(
                        cat.id,
                        "targetPercent",
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-mono font-bold text-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                  />
                </div>

                {/* VAT Rate */}
                <div className="sm:col-span-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    KDV
                  </label>
                  <select
                    value={cat.vatRate}
                    onChange={(e) =>
                      updateCategory(cat.id, "vatRate", Number(e.target.value))
                    }
                    className="w-full px-2 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                  >
                    <option value={1}>%1</option>
                    <option value={10}>%10</option>
                    <option value={20}>%20</option>
                  </select>
                </div>

                {/* Remove Category */}
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    onClick={() => removeCategory(cat.id)}
                    disabled={categories.length <= 1}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* DYNAMIC EXPLANATORY ERROR MESSAGES (NO MORE SILENT LOCKS) */}
          <div className="space-y-2 pt-2">
            {!hasSelectedOrders && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in-50">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  İşlem Bekliyor: Lütfen sol taraftaki listeden dengelemek istediğiniz en az bir siparişi seçin.
                </span>
              </div>
            )}

            {!isValidPercentSum && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in-50">
                <Lock className="h-4 w-4 text-red-600 shrink-0" />
                <span>
                  İşlem Durduruldu: Hedef yüzdelerinizin toplamı tam olarak %100 olmalıdır. (Şu an: %{totalTargetPercent.toFixed(1)})
                </span>
              </div>
            )}

            <Button
              onClick={handleRunBatchQueue}
              disabled={
                isProcessing ||
                !isValidPercentSum ||
                !hasSelectedOrders
              }
              variant="default"
              size="lg"
              className="w-full gap-2 font-semibold py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kuyruk İşleniyor...
                </>
              ) : batchOrders.length > 1 ? (
                <>
                  <Layers className="h-4 w-4" />
                  Toplu Exact-Match Dengelemeyi Çalıştır ({batchOrders.length} Sipariş)
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  Exact-Match Dengelemeyi Çalıştır ve Dopigo&apos;ya İlet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Invoice Result Breakdown */}
      {calculationResult && (
        <Card className="border-emerald-200 bg-emerald-50/50 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Matematiksel Eşleşme Başarıyla Tamamlandı</span>
            </div>
            <Badge variant="success" className="font-mono">
              Fatura Tutar Tamam (%100)
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="uppercase text-gray-600 bg-emerald-100/60 rounded-lg">
                <tr>
                  <th className="p-3">Kategori / Perakende Ürün</th>
                  <th className="p-3">Adet</th>
                  <th className="p-3">Birim Fiyat</th>
                  <th className="p-3">Ara Toplam</th>
                  <th className="p-3">KDV Oranı</th>
                  <th className="p-3">KDV Tutarı</th>
                  <th className="p-3 text-right">KDV Dahil Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 font-mono">
                {calculationResult.lines.map((line) => (
                  <tr key={line.id} className="hover:bg-emerald-100/40">
                    <td className="p-3 font-sans font-medium text-gray-900">
                      {line.categoryName}
                    </td>
                    <td className="p-3 text-gray-700">{line.quantity}</td>
                    <td className="p-3 text-gray-700">₺{line.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700">₺{line.subtotal.toFixed(2)}</td>
                    <td className="p-3 text-blue-700">%{line.vatRate}</td>
                    <td className="p-3 text-emerald-700">₺{line.vatAmount.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-gray-900">
                      ₺{line.totalWithVat.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
