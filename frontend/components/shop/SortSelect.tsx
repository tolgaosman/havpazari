"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { shopHref, withQueryChange } from "@/lib/searchParams";
import type { ProductQuery, SortKey } from "@/types";

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
 * Değişince anında yönlendiren sıralama seçici.
 * Diğer filtreler (kategori/marka/fiyat) `query` prop'u üzerinden korunur.
 */
export function SortSelect({ query }: SortSelectProps) {
  const router = useRouter();
  const selectId = useId();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={selectId} className="shrink-0 text-xs font-medium text-ash-dim">
        Sırala
      </label>
      <select
        id={selectId}
        value={query.sort ?? "onerilen"}
        onChange={(event) => {
          router.push(shopHref(withQueryChange(query, { sort: event.target.value as SortKey })));
        }}
        className="rounded-full border border-steel bg-charcoal px-3 py-2 font-display text-xs font-bold uppercase tracking-wide text-optic focus:border-brass focus:outline-none"
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value} className="bg-charcoal">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
