"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Zap,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Ana Sayfa (Dashboard)",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Fatura Kes (Invoice Generator)",
    href: "/invoice",
    icon: Receipt,
  },
  {
    name: "API Ayarları (Settings)",
    href: "/settings",
    icon: Key,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-slate-800 bg-slate-900 text-white flex flex-col justify-between shadow-xl">
      <div className="p-6">
        {/* Brand Logo & Title Integration (High Contrast Cream Logo on Deep Slate #0F172A) */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="p-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0">
            <img
              src="/logosembol.png"
              alt="EFA Sembol"
              className="h-9 w-9 object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-white tracking-tight text-base leading-tight truncate">
              EFA
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              EXlora Fatura Asistanı
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Ana Menü
          </p>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/invoice" && pathname === "/fatura-kes") ||
              (item.href === "/settings" && pathname === "/ayarlar");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer group",
                  isActive
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "bg-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middleware Engine Status Footnote */}
      <div className="p-4 m-4 rounded-xl bg-slate-800/70 border border-slate-700/60 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-white">
            KDV Asistan Motoru
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-3 font-medium">
          Exact-Match Range algoritması ile KDV limit optimizasyonu aktif.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full w-fit">
          <ShieldCheck className="h-3.5 w-3.5" />
          Kapalı Devre Güvenli
        </div>
      </div>
    </aside>
  );
}
