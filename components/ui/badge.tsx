import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
        secondary:
          "border-slate-200/80 bg-slate-100/80 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:border-white/10",
        destructive:
          "border-red-500/20 bg-red-500/10 text-red-600 dark:bg-red-950/60 dark:text-red-300 dark:border-red-500/30",
        outline: "text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
