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
  Scale,
  Zap,
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
import { ExactMatchResult } from "@/services/balancer";
import { Toast } from "@/components/ui/toast";
import { GibCategoryComboBox } from "./gib-category-combobox";
import { GibVatCategory } from "@/lib/data/gib-categories";

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
      name: "Elektronik Cihazlar, Telefon ve Bilgisayar",
      minPrice: 100,
      maxPrice: 800,
      targetPercent: 50,
      vatRate: 20,
    },
    {
      id: "cat_2",
      name: "Tekstil, Konfeksiyon ve Giyim Ürünleri",
      minPrice: 50,
      maxPrice: 400,
      targetPercent: 30,
      vatRate: 10,
    },
    {
      id: "cat_3",
      name: "Temel Gıda Maddeleri (Un, Ekmek, Süt)",
      minPrice: 30,
      maxPrice: 200,
      targetPercent: 20,
      vatRate: 1,
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

  const totalTargetPercent = categories.reduce(
    (sum, cat) => sum + (Number(cat.targetPercent) || 0),
    0
  );
  const isValidPercentSum = Math.abs(totalTargetPercent - 100) < 0.01;

  const handleAddGibCategory = (gibCategory: GibVatCategory) => {
    setCategories([
      ...categories,
      {
        id: `cat_${Date.now()}`,
        name: gibCategory.name,
        minPrice: 50,
        maxPrice: 500,
        targetPercent: 0,
        vatRate: gibCategory.defaultVatRate,
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
      <Card className="p-6 bg-gray-900 text-white relative border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Exact-Match Range Resolver
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {selectedOrder
                ? `Sipariş: ${selectedOrder.orderNumber}`
                : "Sipariş Seçilmedi"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              Müşteri: {selectedOrder?.customerName || "—"} | TCKN:{" "}
              {selectedOrder?.tckn || "—"}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400">İşlenecek Sipariş Tutarı</span>
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

      {/* Dynamic GİB Category ComboBox & Inputs */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#0066CC]" />
              Resmi GİB KDV Kategorileri & Toleranslar
            </CardTitle>
            <CardDescription>
              Aşağıdan resmi GİB kategorisi arayıp ekleyin ve min-max aralıklarını belirleyin
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GİB Search ComboBox */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Resmi GİB Kategorisi Ekle
            </p>
            <GibCategoryComboBox onSelectCategory={handleAddGibCategory} />
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
                    Kategori Adı #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) =>
                      handleCategoryChange(cat.id, "name", e.target.value)
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
                      handleCategoryChange(
                        cat.id,
                        "minPrice",
                        Number(e.target.value)
                      )
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
                      handleCategoryChange(
                        cat.id,
                        "maxPrice",
                        Number(e.target.value)
                      )
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
                      handleCategoryChange(
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
                      handleCategoryChange(
                        cat.id,
                        "vatRate",
                        Number(e.target.value)
                      )
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
                    onClick={() => handleRemoveCategory(cat.id)}
                    disabled={categories.length <= 1}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors cursor-pointer"
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
              variant="default"
              size="lg"
              className="w-full gap-2 font-semibold py-3.5 text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exact-Match Algoritması Çalışıyor...
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
                  <th className="p-3">Kategori</th>
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
