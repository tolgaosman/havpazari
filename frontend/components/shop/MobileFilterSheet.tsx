"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { soft } from "@/lib/motion";

interface MobileFilterSheetProps {
  /** Sunucuda render edilmiş `<FilterPanel />` çıktısı. */
  children: React.ReactNode;
  resultCount: number;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Mobilde alttan açılan filtre paneli. İçeriği sunucudan `children` olarak alır. */
export function MobileFilterSheet({ children, resultCount }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-steel px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass lg:hidden"
      >
        <SlidersHorizontal className="size-3.5" />
        Filtrele
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-obsidian/80 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filtreler"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={soft}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[85vh] flex-col rounded-t-2xl border-t border-steel bg-charcoal lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-steel px-5 py-4">
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-optic">
                  Filtrele
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Filtreleri kapat"
                  className="flex size-9 items-center justify-center rounded-full text-optic hover:bg-gunmetal"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>

              <div className="border-t border-steel px-5 py-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-brass py-3 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
                >
                  {resultCount} Ürünü Göster
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
