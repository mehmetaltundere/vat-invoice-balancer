"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Zap,
  ArrowRightLeft,
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
    <aside className="w-72 shrink-0 border-r border-slate-200/70 bg-white/70 backdrop-blur-2xl text-slate-900 flex flex-col justify-between dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100">
      <div className="p-6">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base leading-tight">
              Nexus VAT Bridge
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              IdeaSoft ↔ Dopigo
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3.5 mb-2">
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
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 group relative",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 active:scale-[0.98]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/60"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middleware Engine Status Footnote */}
      <div className="p-4 m-4 rounded-3xl bg-slate-100/80 border border-slate-200/80 dark:bg-slate-900/60 dark:border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Dengeleme Motoru
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
          Exact-Match Range algoritması ile KDV limit optimizasyonu aktif.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
          <ShieldCheck className="h-3.5 w-3.5" />
          Kapalı Devre Güvenli
        </div>
      </div>
    </aside>
  );
}
