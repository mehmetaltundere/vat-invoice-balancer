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
  iconColor = "text-blue-600 bg-blue-50 border border-blue-100",
}: StatCardProps) {
  return (
    <Card className="hover:border-gray-300 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <div className={cn("p-2.5 rounded-xl", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-xl font-bold tracking-tight text-gray-900 font-mono">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {change && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-semibold px-2 py-0.5 rounded-md text-[11px]",
                changeType === "positive"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : changeType === "negative"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              )}
            >
              {change}
            </span>
            <span className="text-gray-400 text-[10px]">Son 24 saat</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
