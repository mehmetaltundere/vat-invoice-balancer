import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-xl transition-all duration-200 focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-[#0A84FF]/30 bg-[#0A84FF]/15 text-[#0A84FF]",
        secondary:
          "border-white/10 bg-white/10 text-zinc-300",
        destructive:
          "border-[#FF453A]/30 bg-[#FF453A]/15 text-[#FF453A]",
        outline: "text-zinc-300 border-white/15",
        success:
          "border-[#30D158]/30 bg-[#30D158]/15 text-[#30D158]",
        warning:
          "border-[#FF9F0A]/30 bg-[#FF9F0A]/15 text-[#FF9F0A]",
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
