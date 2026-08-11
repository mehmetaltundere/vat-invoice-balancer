import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none spring-bounce",
  {
    variants: {
      variant: {
        default:
          "bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/25 hover:bg-[#0077ED] active:scale-[0.97]",
        apple:
          "bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/30 hover:brightness-110 active:scale-[0.97]",
        success:
          "bg-[#30D158] text-black shadow-lg shadow-[#30D158]/25 hover:brightness-110 active:scale-[0.97]",
        destructive:
          "bg-[#FF453A] text-white shadow-sm hover:bg-[#FF3B30] active:scale-[0.97]",
        outline:
          "border border-white/15 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 active:scale-[0.97]",
        secondary:
          "bg-white/10 text-white hover:bg-white/15 backdrop-blur-md active:scale-[0.97]",
        ghost:
          "hover:bg-white/10 text-zinc-300 hover:text-white active:scale-[0.97]",
        link: "text-[#0A84FF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-[11px]",
        lg: "h-12 rounded-2xl px-6 text-sm font-bold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
