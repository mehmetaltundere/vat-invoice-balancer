"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Calendar, Database, Send, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const [currentDateStr, setCurrentDateStr] = useState<string>("");

  useEffect(() => {
    setCurrentDateStr(formatDate(new Date()));
  }, []);

  return (
    <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 text-gray-900">
      {/* Date & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200">
          <Calendar className="h-3.5 w-3.5 text-[#0066CC]" />
          <span>{currentDateStr || "11 Ağustos 2026"}</span>
        </div>
      </div>

      {/* Status Indicators & Profile */}
      <div className="flex items-center gap-4">
        {/* System Active Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Sistem Aktif
        </div>

        {/* Integration Status Badges */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Database className="h-3.5 w-3.5 text-[#0066CC]" />
            IdeaSoft: <span className="font-semibold text-emerald-700">Bağlı</span>
          </Badge>
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Send className="h-3.5 w-3.5 text-purple-600" />
            Dopigo: <span className="font-semibold text-emerald-700">Bağlı</span>
          </Badge>
        </div>

        <div className="h-4 w-px bg-gray-200 hidden sm:block" />

        {/* Notifications & Admin Profile */}
        <div className="flex items-center gap-3">
          <button className="h-9 w-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-[#0066CC] rounded-full" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#0066CC] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-gray-900">
                Sistem Yöneticisi
              </p>
              <p className="text-[11px] text-gray-500 font-medium">E-Ticaret Operasyon</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
