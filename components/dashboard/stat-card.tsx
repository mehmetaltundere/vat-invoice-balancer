import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400",
}: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            {title}
          </p>
          <div className={cn("p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {change && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-semibold px-2 py-0.5 rounded-md",
                changeType === "positive"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : changeType === "negative"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              {change}
            </span>
            <span className="text-slate-400 text-[11px]">Son 24 saat</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
