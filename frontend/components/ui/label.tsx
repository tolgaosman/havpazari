import * as React from "react";
import { Label as RadixLabel } from "radix-ui";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  React.ComponentPropsWithoutRef<typeof RadixLabel.Root>
>(({ className, ...props }, ref) => (
  <RadixLabel.Root
    ref={ref}
    className={cn(
      "mb-1.5 block font-display text-xs font-bold uppercase tracking-wide text-ash",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
