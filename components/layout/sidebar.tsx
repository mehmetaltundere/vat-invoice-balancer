"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
  Zap,
  ArrowRightLeft,
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
    href: "/fatura-kes",
    icon: Receipt,
  },
  {
    name: "Kategori & KDV Ayarları (Settings)",
    href: "/ayarlar",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-slate-900 text-slate-100 flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950">
      <div className="p-6">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 tracking-tight text-base leading-tight">
              Nexus VAT Bridge
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              IdeaSoft ↔ Dopigo
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Ana Menü
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150 group relative",
                  isActive
                    ? "bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middleware Engine Status Footnote */}
      <div className="p-4 m-4 rounded-xl bg-slate-800/50 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-200">
            Dengeleme Motoru
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Exact-Match Range algoritması ile KDV limit optimizasyonu aktif.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          Kapalı Devre Güvenli
        </div>
      </div>
    </aside>
  );
}
