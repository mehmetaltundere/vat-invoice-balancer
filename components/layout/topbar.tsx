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
    <header className="h-16 border-b border-slate-200/70 bg-white/70 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-30 dark:border-white/10 dark:bg-slate-950/70">
      {/* Date & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
          <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>{currentDateStr || "11 Ağustos 2026"}</span>
        </div>
      </div>

      {/* Status Indicators & Profile */}
      <div className="flex items-center gap-4">
        {/* System Active Badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Sistem Aktif
        </div>

        {/* Integration Status Badges */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Database className="h-3.5 w-3.5 text-blue-500" />
            IdeaSoft: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bağlı</span>
          </Badge>
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Send className="h-3.5 w-3.5 text-purple-500" />
            Dopigo: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bağlı</span>
          </Badge>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Notifications & Admin Profile */}
        <div className="flex items-center gap-3">
          <button className="h-9 w-9 rounded-2xl border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-all relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Sistem Yöneticisi
              </p>
              <p className="text-[11px] text-slate-400 font-medium">E-Ticaret Operasyon</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
