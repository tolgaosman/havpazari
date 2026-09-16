"use client";

import { useId, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { shopHref, withQueryChange } from "@/lib/searchParams";
import type { ProductQuery, SortKey } from "@/types";
import { cn } from "@/lib/utils";

const SORT_LABELS: Record<SortKey, string> = {
  onerilen: "Önerilen",
  "fiyat-artan": "Fiyat: Artan",
  "fiyat-azalan": "Fiyat: Azalan",
  yeni: "Yeni Gelenler",
  isim: "İsim (A-Z)",
};

interface SortSelectProps {
  query: ProductQuery;
}

/**
 * Değişince anında yönlendiren özel sıralama seçici.
 * Diğer filtreler (kategori/marka/fiyat) `query` prop'u üzerinden korunur.
 */
export function SortSelect({ query }: SortSelectProps) {
  const router = useRouter();
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort = query.sort ?? "onerilen";

  // Dışarı tıklanınca menüyü kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape tuşuna basılınca kapat
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (value: SortKey) => {
    setIsOpen(false);
    router.push(shopHref(withQueryChange(query, { sort: value })));
  };

  return (
    <div className="flex items-center gap-3" ref={dropdownRef}>
      <label htmlFor={selectId} className="shrink-0 text-xs font-medium text-ash-dim">
        Sırala
      </label>
      <div className="relative">
        <button
          id={selectId}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            "flex w-[170px] items-center justify-between rounded-full border bg-charcoal px-4 py-2",
            "font-display text-xs font-bold uppercase tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:border-brass",
            isOpen
              ? "border-brass text-brass shadow-[0_0_15px_rgba(202,152,73,0.15)]"
              : "border-steel text-optic hover:border-brass/70 hover:text-brass hover:shadow-[0_0_15px_rgba(202,152,73,0.1)]"
          )}
        >
          <span className="truncate">{SORT_LABELS[currentSort]}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="shrink-0 ml-2"
          >
            <ChevronDown className="size-4 opacity-70" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-[200px] origin-top-right overflow-hidden rounded-xl border border-steel bg-obsidian p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl"
              role="listbox"
            >
              <div className="flex flex-col gap-0.5">
                {Object.entries(SORT_LABELS).map(([value, label]) => {
                  const isSelected = currentSort === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(value as SortKey)}
                      className={cn(
                        "group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-display text-xs font-bold uppercase tracking-wide transition-all duration-200",
                        isSelected
                          ? "bg-brass/10 text-brass"
                          : "text-ash hover:bg-steel/30 hover:text-optic"
                      )}
                    >
                      <span className="relative z-10">{label}</span>
                      {isSelected && (
                        <motion.div
                          layoutId="sort-check"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className="relative z-10 shrink-0"
                        >
                          <Check className="size-4" />
                        </motion.div>
                      )}
                      {!isSelected && (
                        <div className="absolute inset-0 rounded-lg bg-steel/0 transition-colors duration-200 group-hover:bg-steel/20" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
