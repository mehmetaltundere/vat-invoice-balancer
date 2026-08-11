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
  iconColor = "text-[#0A84FF] bg-[#0A84FF]/15 border border-[#0A84FF]/30",
}: StatCardProps) {
  return (
    <Card className="hover:border-white/20 transition-all spring-bounce">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            {title}
          </p>
          <div className={cn("p-2.5 rounded-2xl", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-2xl font-bold tracking-tight text-white font-mono">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {change && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-bold px-2.5 py-0.5 rounded-full text-[11px]",
                changeType === "positive"
                  ? "bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30"
                  : changeType === "negative"
                  ? "bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30"
                  : "bg-white/10 text-zinc-300 border border-white/15"
              )}
            >
              {change}
            </span>
            <span className="text-zinc-500 text-[10px]">Son 24 saat</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
