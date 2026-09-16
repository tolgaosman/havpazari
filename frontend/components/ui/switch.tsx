"use client";

import * as React from "react";
import { Switch as RadixSwitch } from "radix-ui";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>
>(({ className, ...props }, ref) => (
  <RadixSwitch.Root
    ref={ref}
    className={cn(
      "relative h-6 w-11 shrink-0 rounded-full bg-steel transition-colors duration-200 data-[state=checked]:bg-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <RadixSwitch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-optic transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-[1.375rem]" />
  </RadixSwitch.Root>
));
Switch.displayName = "Switch";

export { Switch };
