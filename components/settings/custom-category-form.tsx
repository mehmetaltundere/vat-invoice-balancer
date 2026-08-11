"use client";

import React, { useState } from "react";
import { Plus, ShieldAlert, CheckCircle, Trash2, Sliders } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomCategorySchema } from "@/lib/security/category-schema";
import { Toast } from "@/components/ui/toast";

export interface CustomCategoryItem {
  id: string;
  name: string;
  vatRate: 1 | 10 | 20;
  description?: string;
}

export function CustomCategoryForm() {
  const [name, setName] = useState("");
  const [vatRate, setVatRate] = useState<number>(20);
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customList, setCustomList] = useState<CustomCategoryItem[]>([
    {
      id: "cust_1",
      name: "Özel Aksesuar Ürünleri (Manuel Eşleşme)",
      vatRate: 20,
      description: "GİB resmi kodu harici özel eşleştirme",
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = CustomCategorySchema.safeParse({
      name,
      vatRate: Number(vatRate),
      description,
    });

    if (!result.success) {
      const formattedErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    const newCategory: CustomCategoryItem = {
      id: `cust_${Date.now()}`,
      name: result.data.name,
      vatRate: result.data.vatRate as 1 | 10 | 20,
      description: result.data.description,
    };

    setCustomList([...customList, newCategory]);
    setName("");
    setDescription("");
    setToastMessage(`"${newCategory.name}" kategorisi güvenle kaydedildi.`);
  };

  const handleRemove = (id: string) => {
    setCustomList(customList.filter((item) => item.id !== id));
  };

  return (
    <Card className="mt-8">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0066CC] border border-blue-100">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">
                Özel KDV Kategorileri Tanımlama (Zod Korumalı)
              </CardTitle>
              <CardDescription>
                Resmi listede bulunmayan özel ürün sınıflarını güvenli doğrulama ile sisteme tanımlayın
              </CardDescription>
            </div>
          </div>
          <Badge variant="warning" className="gap-1.5 hidden sm:flex">
            <ShieldAlert className="h-3.5 w-3.5" /> GİB Sorumluluk Uyarısı
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Category Name */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Kategori Resmi Adı
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Optik Çerçeveler..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
              />
              {errors.name && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* VAT Rate */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                KDV Oranı
              </label>
              <select
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
              >
                <option value={1}>%1</option>
                <option value={10}>%10</option>
                <option value={20}>%20</option>
              </select>
              {errors.vatRate && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.vatRate}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Mevzuat Notu / Açıklama
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: 2026/08 Matrah Eşik Kararı..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="default" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Manuel Kategori Ekle
            </Button>
          </div>
        </form>

        {/* Existing Custom Categories List */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Kayıtlı Özel KDV Kategorileri ({customList.length})
          </p>
          <div className="space-y-2">
            {customList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs row-micro"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">
                    {item.name}
                  </span>
                  <Badge variant="default" className="font-mono">
                    %{item.vatRate} KDV
                  </Badge>
                  {item.description && (
                    <span className="text-gray-500 text-[11px]">
                      — {item.description}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {toastMessage && (
        <Toast
          title="Kategori Kaydedildi"
          description={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </Card>
  );
}
