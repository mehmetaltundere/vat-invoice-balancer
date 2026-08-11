"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  fetchVATDatabase,
  GranularVatItem,
} from "@/lib/services/vat-database";
import { Search, Info, ChevronDown, Loader2, Cloud } from "lucide-react";

interface GibCategoryComboBoxProps {
  onSelectCategory: (item: GranularVatItem) => void;
}

export function GibCategoryComboBox({
  onSelectCategory,
}: GibCategoryComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<GranularVatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      fetchVATDatabase(query).then((data) => {
        if (isMounted) {
          setItems(data);
          setIsLoading(false);
        }
      });
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      {/* Search ComboBox Input */}
      <div className="relative flex-1">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-800 hover:border-gray-300 cursor-pointer shadow-xs transition-all hover:scale-[1.01] active:scale-98"
        >
          <div className="flex items-center gap-2 truncate">
            <Cloud className="h-3.5 w-3.5 text-[#0066CC] shrink-0" />
            <span className="truncate text-gray-700">
              {query || "Cloud KDV Veritabanından Ürün/Kategori Ara (Örn: Kurdele, Toka, Gözlük)..."}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-full z-50 rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95">
            <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-gray-400 ml-1" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Perakende ürün adı veya SKU ara (Örn: Saten Kurdele)..."
                autoFocus
                className="w-full bg-transparent text-xs text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none"
              />
              {isLoading && <Loader2 className="h-3.5 w-3.5 text-[#0066CC] animate-spin shrink-0 mr-1" />}
            </div>

            <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
              {items.length === 0 && !isLoading ? (
                <div className="p-3 text-center text-xs text-gray-400 font-medium">
                  Cloud veritabanında eşleşen perakende ürün bulunamadı.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectCategory(item);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-gray-900 group-hover:text-[#0066CC]">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                          {item.sku}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        Grup: {item.categoryGroup} ({item.officialGibMatch})
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#0066CC] shrink-0 ml-2">
                      %{item.vatRate} KDV
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Icon & Compliance Tooltip */}
      <div className="relative">
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          className="p-2 rounded-xl text-gray-400 hover:text-[#0066CC] hover:bg-gray-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Info className="h-4 w-4" />
        </button>

        {showTooltip && (
          <div className="absolute right-0 top-full mt-2 w-72 p-3.5 bg-gray-900 text-white text-[11px] leading-relaxed rounded-xl shadow-2xl z-50 border border-gray-700 animate-in fade-in-50">
            <p className="font-medium">
              Aradığınız kategoriyi bulamadıysanız Ayarlar&apos;dan ekleyebilirsiniz.{" "}
              <strong className="text-amber-400">DİKKAT:</strong> Eklediğiniz ismin resmi GİB karşılığı olduğundan emin olun, aksi halde vergi cezaları ile karşılaşabilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
