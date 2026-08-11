"use client";

import { Badge } from "@/components/ui/badge";
import { Zap, ShieldCheck } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
      {/* Left side empty - Branding handled exclusively by Sidebar */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        <span>KDV Dengeleme Servisi</span>
      </div>

      {/* Right side Status Indicators & System Info */}
      <div className="flex items-center gap-3">
        <Badge variant="success" className="gap-1.5 hidden sm:flex font-mono text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          IdeaSoft & Dopigo Köprüsü Aktif
        </Badge>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          EFA v2.0 Masaüstü
        </span>
      </div>
    </header>
  );
}
