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
    <aside className="w-72 shrink-0 border-r border-white/10 bg-[#1c1c1e]/85 backdrop-blur-3xl text-white flex flex-col justify-between">
      <div className="p-6">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
          <div className="h-10 w-10 rounded-2xl bg-[#0A84FF] flex items-center justify-center text-white shadow-lg shadow-[#0A84FF]/30 spring-bounce">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-base leading-tight">
              Nexus VAT Bridge
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">
              IdeaSoft ↔ Dopigo
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-3.5 mb-2">
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
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 spring-bounce",
                  isActive
                    ? "bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middleware Engine Status Footnote */}
      <div className="p-4 m-4 rounded-3xl bg-[#2c2c2e]/60 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-[#FF9F0A]" />
          <span className="text-xs font-bold text-white">
            Dengeleme Motoru
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed mb-3 font-medium">
          Exact-Match Range algoritması ile KDV limit optimizasyonu aktif.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#30D158] bg-[#30D158]/15 border border-[#30D158]/30 px-3 py-1 rounded-full w-fit">
          <ShieldCheck className="h-3.5 w-3.5" />
          Kapalı Devre Güvenli
        </div>
      </div>
    </aside>
  );
}
