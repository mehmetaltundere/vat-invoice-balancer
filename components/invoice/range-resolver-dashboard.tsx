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
  Download,
  Copy,
  Check,
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

const EFA_STORAGE_KEY = "efa_vat_api_settings";
const LEGACY_STORAGE_KEY = "nexus_vat_api_settings";

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

  const [copiedJson, setCopiedJson] = useState(false);

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
      const saved =
        localStorage.getItem(EFA_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY);
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

  const handleDownloadInvoiceJson = () => {
    if (!calculationResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calculationResult, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `EFA_Fatura_${calculationResult.orderId || "ozet"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyInvoiceJson = () => {
    if (!calculationResult) return;
    navigator.clipboard.writeText(JSON.stringify(calculationResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleExecuteSingleResolution = async () => {
    if (!selectedOrder) {
      setToastInfo({
        title: "Sipariş Seçilmedi",
        description: "Lütfen sol listeden faturalandırmak istediğiniz bir sipariş seçin.",
        type: "error",
      });
      return;
    }

    if (!isValidPercentSum) {
      setToastInfo({
        title: "Hedef Yüzde Uyarısı",
        description: `Hedef yüzdelerin toplamı tam olarak %100 olmalıdır. (Şu an: %${totalTargetPercent})`,
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    setToastInfo(null);

    try {
      const result = executeExactMatchResolver(
        selectedOrder.id,
        selectedOrder.totalAmount,
        categories
      );
      setCalculationResult(result);

      const creds = getApiCredentials();

      // Send to Dopigo API Route
      const dopigoRes = await fetch("/api/dopigo/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dopigo-api-token": creds.dopigoApiToken,
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          customerName: selectedOrder.customerName,
          tckn: selectedOrder.tckn,
          lines: result.lines,
          totalAmount: result.totalCalculatedAmount,
        }),
      });

      const dopigoJson = await dopigoRes.json();

      if (!dopigoRes.ok || !dopigoJson.success) {
        throw new Error(dopigoJson.message || "Dopigo e-fatura servisi faturayı kabul etmedi.");
      }

      // Loop-Back: Update IdeaSoft order status to BALANCED
      await fetch(`/api/ideasoft/orders/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ideasoft-client-id": creds.ideaSoftClientId,
          "x-ideasoft-client-secret": creds.ideaSoftClientSecret,
        },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: "BALANCED",
        }),
      }).catch(() => {});

      updateOrder({
        ...selectedOrder,
        status: "BALANCED",
      });

      setToastInfo({
        title: "Exact-Match Başarılı! 🎉",
        description: `${selectedOrder.orderNumber} siparişi için ₺${result.totalCalculatedAmount.toFixed(2)} tutarında e-Fatura oluşturuldu ve IdeaSoft güncellendi.`,
        type: "success",
      });
    } catch (error: any) {
      setToastInfo({
        title: "Dopigo İletim Hatası",
        description: error.message || "e-Fatura oluşturulurken beklenmeyen bir hata oluştu.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteBatchQueue = async () => {
    if (batchOrders.length === 0) return;

    if (!isValidPercentSum) {
      setToastInfo({
        title: "Hedef Yüzde Hatası",
        description: `Hedef yüzdelerin toplamı tam olarak %100 olmalıdır. (Şu an: %${totalTargetPercent})`,
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    setToastInfo(null);
    const completedIds: string[] = [];
    const creds = getApiCredentials();

    try {
      for (let i = 0; i < batchOrders.length; i++) {
        const order = batchOrders[i];
        setBatchProgress({
          current: i + 1,
          total: batchOrders.length,
          currentOrder: order.orderNumber,
        });

        const result = executeExactMatchResolver(
          order.id,
          order.totalAmount,
          categories
        );

        // POST to Dopigo
        await fetch("/api/dopigo/invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-dopigo-api-token": creds.dopigoApiToken,
          },
          body: JSON.stringify({
            orderId: order.id,
            customerName: order.customerName,
            tckn: order.tckn,
            lines: result.lines,
            totalAmount: result.totalCalculatedAmount,
          }),
        });

        // Loop-Back: Update IdeaSoft order status
        await fetch(`/api/ideasoft/orders/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-ideasoft-client-id": creds.ideaSoftClientId,
            "x-ideasoft-client-secret": creds.ideaSoftClientSecret,
          },
          body: JSON.stringify({
            id: order.id,
            status: "BALANCED",
          }),
        }).catch(() => {});

        updateOrder({
          ...order,
          status: "BALANCED",
        });

        completedIds.push(order.id);
        await new Promise((r) => setTimeout(r, 400));
      }

      if (onBatchCompleted) {
        onBatchCompleted(completedIds);
      }

      setToastInfo({
        title: "Toplu İşlem Tamamlandı! 🚀",
        description: `Seçilen ${batchOrders.length} adet sipariş için sırasıyla faturalandırma ve durum güncellemeleri başarıyla yapıldı.`,
        type: "success",
      });
    } catch (error: any) {
      setToastInfo({
        title: "Kuyruk İşlem Hatası",
        description: error.message || "Toplu işlem sırasında bir hata meydana geldi.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
      setBatchProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {toastInfo && (
        <Toast
          title={toastInfo.title}
          description={toastInfo.description}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}

      {/* Main Category Distribution Card */}
      <Card className="bg-white border border-slate-200">
        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#0066CC]" />
              KDV Hedef Matrah & Fiyat Limitleri
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Her kategori için hedeflenen fatura payını (%) ve birim fiyat sınırlarını belirleyin.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                isValidPercentSum
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Toplam: %{totalTargetPercent}</span>
              {isValidPercentSum ? (
                <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.2 rounded font-bold">TAM</span>
              ) : (
                <span className="text-[10px] bg-red-200/60 px-1.5 py-0.2 rounded font-bold">KİLİTLİ</span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {/* Categories Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-2">Kategori Adı</th>
                  <th className="pb-3 px-2 w-28">KDV Oranı</th>
                  <th className="pb-3 px-2 w-28">Min Fiyat (₺)</th>
                  <th className="pb-3 px-2 w-28">Max Fiyat (₺)</th>
                  <th className="pb-3 px-2 w-28">Hedef Pay (%)</th>
                  <th className="pb-3 px-2 w-12 text-center">Sil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => updateCategory(cat.id, "name", e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <select
                        value={cat.vatRate}
                        onChange={(e) => updateCategory(cat.id, "vatRate", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                      >
                        <option value={1}>%1</option>
                        <option value={10}>%10</option>
                        <option value={20}>%20</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min={1}
                        value={cat.minPrice}
                        onChange={(e) => updateCategory(cat.id, "minPrice", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min={cat.minPrice}
                        value={cat.maxPrice}
                        onChange={(e) => updateCategory(cat.id, "maxPrice", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={cat.targetPercent}
                          onChange={(e) => updateCategory(cat.id, "targetPercent", Number(e.target.value))}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 ${
                            isValidPercentSum
                              ? "border-slate-200 focus:ring-[#0066CC]"
                              : "border-red-300 bg-red-50/40 text-red-900 focus:ring-red-500"
                          }`}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => removeCategory(cat.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Satırı Kaldır"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick GİB Category Inserter */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <GibCategoryComboBox onSelectCategory={handleAddGranularItem} />
            </div>
            <button
              onClick={() =>
                addCategory({
                  id: `cat_${Date.now()}`,
                  name: "Yeni KDV Kalemi",
                  minPrice: 50,
                  maxPrice: 300,
                  targetPercent: 0,
                  vatRate: 20,
                })
              }
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
            >
              + Boş Satır Ekle
            </button>
          </div>

          {/* Dynamic Explanatory Alert Boxes */}
          {!hasSelectedOrders && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">İşlem Bekliyor:</p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Lütfen sol taraftaki listeden dengelemek istediğiniz en az bir siparişi seçin veya toplu seçim yapın.
                </p>
              </div>
            </div>
          )}

          {!isValidPercentSum && (
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Matematik Kilidi Aktif:</p>
                <p className="text-red-800 text-[11px] mt-0.5">
                  İşlem Durduruldu: Hedef yüzdelerinizin toplamı tam olarak %100 olmalıdır. (Şu anki toplam: %{totalTargetPercent})
                </p>
              </div>
            </div>
          )}

          {/* Live Progress Bar for Batch Queue */}
          {batchProgress && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0066CC]" />
                  Toplu Fatura Kesiliyor ({batchProgress.currentOrder})
                </span>
                <span>{batchProgress.current} / {batchProgress.total}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0066CC] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Execution Button */}
          <div className="pt-2">
            {batchOrders.length > 1 ? (
              <Button
                onClick={handleExecuteBatchQueue}
                disabled={!isValidPercentSum || isProcessing}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-2 rounded-xl shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Toplu Kuyruk İşleniyor...
                  </>
                ) : (
                  <>
                    {!isValidPercentSum ? <Lock className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                    Seçilen {batchOrders.length} Siparişi Toplu Olarak Exact-Match Dengele ve Kes
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleExecuteSingleResolution}
                disabled={!isValidPercentSum || !selectedOrder || isProcessing}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-2 rounded-xl shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Dengeleme Hesaplanıyor & Dopigo'ya İletiliyor...
                  </>
                ) : (
                  <>
                    {!isValidPercentSum || !selectedOrder ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    Exact-Match Dengelemeyi Çalıştır & Dopigo e-Fatura Gönder
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calculation Result Breakdown Table & Export Bar */}
      {calculationResult && (
        <Card className="bg-white border border-emerald-200 shadow-sm animate-in fade-in duration-300">
          <CardHeader className="p-5 border-b border-emerald-100 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Dengelenen Fatura Çıktısı (Kuruş Hassasiyeti: %100)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Sipariş Tutarı: ₺{calculationResult.totalOriginalAmount.toFixed(2)} | Hesaplanan: ₺{calculationResult.totalCalculatedAmount.toFixed(2)}
                </CardDescription>
              </div>
            </div>

            {/* Export & Copy Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyInvoiceJson}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                title="JSON Kopyala"
              >
                {copiedJson ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                {copiedJson ? "Kopyalandı" : "JSON Kopyala"}
              </button>
              <button
                onClick={handleDownloadInvoiceJson}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                title="JSON İndir"
              >
                <Download className="h-3.5 w-3.5" />
                Fatura İndir
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase">
                    <th className="pb-2 px-2">Kalem / Açıklama</th>
                    <th className="pb-2 px-2 text-right">Adet</th>
                    <th className="pb-2 px-2 text-right">Birim Fiyat</th>
                    <th className="pb-2 px-2 text-right">Matrah (Net)</th>
                    <th className="pb-2 px-2 text-right">KDV</th>
                    <th className="pb-2 px-2 text-right">KDV Tutarı</th>
                    <th className="pb-2 px-2 text-right">Genel Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculationResult.lines.map((line) => (
                    <tr key={line.id} className="hover:bg-slate-50 font-mono">
                      <td className="py-2.5 px-2 font-sans font-medium text-slate-900">{line.categoryName}</td>
                      <td className="py-2.5 px-2 text-right font-bold">{line.quantity}</td>
                      <td className="py-2.5 px-2 text-right">₺{line.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-right">₺{line.subtotal.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-700">%{line.vatRate}</td>
                      <td className="py-2.5 px-2 text-right text-emerald-700 font-semibold">₺{line.vatAmount.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-900">₺{line.totalWithVat.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 font-mono font-bold text-xs bg-slate-50">
                    <td className="py-3 px-2 font-sans">GENEL TOPLAM</td>
                    <td className="py-3 px-2 text-right">
                      {calculationResult.lines.reduce((s, l) => s + l.quantity, 0)}
                    </td>
                    <td className="py-3 px-2 text-right">-</td>
                    <td className="py-3 px-2 text-right">
                      ₺{calculationResult.lines.reduce((s, l) => s + l.subtotal, 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right">-</td>
                    <td className="py-3 px-2 text-right text-emerald-700">
                      ₺{calculationResult.totalVatAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-blue-700 text-sm">
                      ₺{calculationResult.totalCalculatedAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
