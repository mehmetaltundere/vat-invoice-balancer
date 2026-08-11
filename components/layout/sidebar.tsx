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
    <aside className="w-72 shrink-0 border-r border-gray-200 bg-[#F4F4F5] text-gray-900 flex flex-col justify-between shadow-xs">
      <div className="p-6">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200/80">
          <div className="h-10 w-10 rounded-xl bg-[#0066CC] flex items-center justify-center text-white shadow-xs">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 tracking-tight text-base leading-tight">
              Nexus VAT Bridge
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              IdeaSoft ↔ Dopigo
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1">
          <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase px-3 mb-2">
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
                    ? "bg-[#0066CC] text-white shadow-xs"
                    : "bg-transparent text-gray-700 hover:bg-gray-200/70 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middleware Engine Status Footnote */}
      <div className="p-4 m-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-gray-800">
            Dengeleme Motoru
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 font-medium">
          Exact-Match Range algoritması ile KDV limit optimizasyonu aktif.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
          <ShieldCheck className="h-3.5 w-3.5" />
          Kapalı Devre Güvenli
        </div>
      </div>
    </aside>
  );
}
