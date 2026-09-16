"use client";

import * as React from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;
const DialogClose = RadixDialog.Close;

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixDialog.Content> & { showClose?: boolean }) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-[80] bg-obsidian/80 backdrop-blur-sm" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-steel bg-charcoal p-6 shadow-xl focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <RadixDialog.Close
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-ash transition-colors duration-200 hover:bg-gunmetal hover:text-optic"
            aria-label="Kapat"
          >
            <X className="size-4" />
          </RadixDialog.Close>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

function DialogTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixDialog.Title>) {
  return (
    <RadixDialog.Title
      className={cn("text-display-sm font-bold uppercase text-optic", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixDialog.Description>) {
  return <RadixDialog.Description className={cn("mt-2 text-sm text-ash", className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription };
