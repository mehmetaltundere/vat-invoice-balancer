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
    <header className="h-16 border-b border-white/10 bg-[#1c1c1e]/85 backdrop-blur-3xl px-6 flex items-center justify-between sticky top-0 z-30 text-white">
      {/* Date & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <Calendar className="h-3.5 w-3.5 text-[#0A84FF]" />
          <span>{currentDateStr || "11 Ağustos 2026"}</span>
        </div>
      </div>

      {/* Status Indicators & Profile */}
      <div className="flex items-center gap-4">
        {/* System Active Badge */}
        <div className="flex items-center gap-2 bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
          </span>
          Sistem Aktif
        </div>

        {/* Integration Status Badges */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Database className="h-3.5 w-3.5 text-[#0A84FF]" />
            IdeaSoft: <span className="font-bold text-[#30D158]">Bağlı</span>
          </Badge>
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Send className="h-3.5 w-3.5 text-[#BF5AF2]" />
            Dopigo: <span className="font-bold text-[#30D158]">Bağlı</span>
          </Badge>
        </div>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Notifications & Admin Profile */}
        <div className="flex items-center gap-3">
          <button className="h-9 w-9 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-all spring-bounce relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-[#0A84FF] rounded-full" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#0A84FF] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#0A84FF]/30 spring-bounce">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-white">
                Sistem Yöneticisi
              </p>
              <p className="text-[10px] text-zinc-400 font-medium">E-Ticaret Operasyon</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
