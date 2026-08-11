"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Gösterge Paneli (Dashboard)";
      case "/invoice":
      case "/fatura-kes":
        return "Fatura Dengeleme ve Kesme Ekranı";
      case "/settings":
      case "/ayarlar":
        return "API Kimlik ve Kategori Ayarları";
      default:
        return "EFA - EXlora Fatura Asistanı";
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
      {/* Brand & Page Header */}
      <div className="flex items-center gap-4">
        <img
          src="/isimhalilogo.png"
          alt="EFA - EXlora Fatura Asistanı"
          className="h-8 w-auto object-contain shrink-0"
        />
        <div className="h-4 w-px bg-gray-200 hidden sm:block" />
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">
          {getPageTitle(pathname)}
        </h2>
      </div>

      {/* System Status Indicators */}
      <div className="flex items-center gap-3">
        <Badge variant="success" className="gap-1.5 hidden sm:flex font-mono text-[11px]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          IdeaSoft & Dopigo Köprüsü Aktif
        </Badge>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-xl">
          v2.0 Masaüstü
        </span>
      </div>
    </header>
  );
}
