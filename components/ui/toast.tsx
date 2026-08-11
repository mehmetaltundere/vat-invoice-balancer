"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id?: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  title,
  description,
  type = "success",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 backdrop-blur-2xl border max-w-md w-full animate-in slide-in-from-bottom-5",
        type === "success"
          ? "bg-white/90 border-emerald-500/20 text-slate-900 dark:bg-slate-900/90 dark:border-emerald-500/30 dark:text-slate-100 shadow-emerald-500/10"
          : type === "error"
          ? "bg-white/90 border-red-500/20 text-slate-900 dark:bg-slate-900/90 dark:border-red-500/30 dark:text-slate-100 shadow-red-500/10"
          : "bg-white/90 border-blue-500/20 text-slate-900 dark:bg-slate-900/90 dark:border-blue-500/30 dark:text-slate-100 shadow-blue-500/10"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-xl shrink-0",
          type === "success"
            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
            : type === "error"
            ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
            : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        )}
      >
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold tracking-tight leading-none">
          {title}
        </p>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
