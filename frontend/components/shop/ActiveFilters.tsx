import Link from "next/link";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { shopHref, withQueryChange } from "@/lib/searchParams";
import type { Brand, Category, ProductQuery } from "@/types";

interface ActiveFiltersProps {
  query: ProductQuery;
  categories: Category[];
  brands: Brand[];
}

interface Chip {
  key: string;
  label: string;
  href: string;
}

/** Uygulanan filtreleri kaldırılabilir etiketler olarak gösterir. */
export function ActiveFilters({ query, categories, brands }: ActiveFiltersProps) {
  const chips: Chip[] = [];

  if (query.q) {
    chips.push({
      key: "q",
      label: `"${query.q}"`,
      href: shopHref(withQueryChange(query, { q: undefined })),
    });
  }

  if (query.category) {
    const category = categories.find((c) => c.slug === query.category);
    chips.push({
      key: "category",
      label: category?.name ?? query.category,
      href: shopHref(withQueryChange(query, { category: undefined })),
    });
  }

  for (const slug of query.brands ?? []) {
    const brand = brands.find((b) => b.slug === slug);
    chips.push({
      key: `brand-${slug}`,
      label: brand?.name ?? slug,
      href: shopHref(
        withQueryChange(query, {
          brands: query.brands?.filter((b) => b !== slug),
        }),
      ),
    });
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const min = query.minPrice !== undefined ? formatPrice(query.minPrice) : "0";
    const max = query.maxPrice !== undefined ? formatPrice(query.maxPrice) : "∞";
    chips.push({
      key: "price",
      label: `${min} – ${max}`,
      href: shopHref(withQueryChange(query, { minPrice: undefined, maxPrice: undefined })),
    });
  }

  if (query.inStockOnly) {
    chips.push({
      key: "stock",
      label: "Stokta olanlar",
      href: shopHref(withQueryChange(query, { inStockOnly: undefined })),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          className="group flex items-center gap-1.5 rounded-full border border-steel bg-charcoal py-1.5 pl-3 pr-2 text-xs font-medium text-ash transition-colors duration-150 hover:border-brass hover:text-optic"
        >
          {chip.label}
          <X className="size-3.5 text-ash-dim transition-colors duration-150 group-hover:text-brass" />
        </Link>
      ))}
      <Link
        href="/magaza"
        className="text-xs font-medium text-ash-dim underline-offset-2 transition-colors duration-150 hover:text-brass hover:underline"
      >
        Tümünü temizle
      </Link>
    </div>
  );
}
