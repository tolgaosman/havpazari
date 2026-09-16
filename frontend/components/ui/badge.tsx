import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        neutral: "bg-gunmetal text-ash",
        brass: "bg-brass text-obsidian",
        blaze: "bg-blaze text-optic",
        moss: "bg-moss text-optic",
        outline: "border border-steel text-ash",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
