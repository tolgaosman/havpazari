import Link from "next/link";
import { X } from "lucide-react";
import type { FilterOptions } from "@/lib/api";
import { PARAM, shopHref, toggleBrand, withQueryChange } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import type { ProductQuery } from "@/types";

interface FilterPanelProps {
  query: ProductQuery;
  options: FilterOptions;
}

/**
 * Mağaza kenar çubuğu.
 *
 * Bilinçli mimari tercih: kategori, marka ve stok filtreleri düz `<Link>`
 * öğeleridir — JavaScript olmadan da çalışırlar, hydration uyuşmazlığı
 * riski taşımazlar ve URL zaten tek gerçek kaynak olduğu için ek bir
 * istemci state'ine gerek yoktur. Yalnızca fiyat aralığı bir GET formudur
 * (sayısal girdi aralık kaydırıcıdan daha güvenilir ve erişilebilirdir);
 * diğer tüm filtreler gizli alanlar olarak forma eklenir ki gönderildiğinde
 * kaybolmasınlar.
 */
export function FilterPanel({ query, options }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <FilterSection title="Kategori">
        <ul className="flex flex-col gap-1">
          <li>
            <FacetLink
              href={shopHref(withQueryChange(query, { category: undefined }))}
              label="Tüm Kategoriler"
              count={options.totalProducts}
              active={!query.category}
            />
          </li>
          {options.categories.map((facet) => (
            <li key={facet.slug}>
              <FacetLink
                href={shopHref(withQueryChange(query, { category: facet.slug }))}
                label={facet.name}
                count={facet.count}
                active={query.category === facet.slug}
              />
            </li>
          ))}
        </ul>
      </FilterSection>

      {options.brands.length > 0 && (
        <FilterSection title="Marka">
          <ul className="flex flex-col gap-1">
            {options.brands.map((facet) => {
              const active = query.brands?.includes(facet.slug) ?? false;
              return (
                <li key={facet.slug}>
                  <FacetLink
                    href={shopHref(toggleBrand(query, facet.slug))}
                    label={facet.name}
                    count={facet.count}
                    active={active}
                    multi
                  />
                </li>
              );
            })}
          </ul>
        </FilterSection>
      )}

      {options.priceRange.max > 0 && (
        <FilterSection title="Fiyat Aralığı (₺)">
          <PriceRangeForm query={query} bounds={options.priceRange} />
        </FilterSection>
      )}

      <FilterSection title="Durum">
        <FacetLink
          href={shopHref(
            withQueryChange(query, { inStockOnly: query.inStockOnly ? undefined : true }),
          )}
          label="Yalnızca stokta olanlar"
          active={Boolean(query.inStockOnly)}
          multi
        />
      </FilterSection>

      <Link
        href="/magaza"
        className="flex items-center gap-1.5 text-sm font-medium text-ash transition-colors duration-200 hover:text-brass"
      >
        <X className="size-3.5" aria-hidden="true" />
        Filtreleri Temizle
      </Link>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-steel pb-8 last:border-0 last:pb-0">
      <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-optic">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface FacetLinkProps {
  href: string;
  label: string;
  count?: number;
  active: boolean;
  /** Radyo değil onay kutusu semantiği — birden çok seçilebilir. */
  multi?: boolean;
}

function FacetLink({ href, label, count, active, multi }: FacetLinkProps) {
  return (
    <Link
      href={href}
      aria-current={!multi && active ? "true" : undefined}
      className="group flex items-center justify-between gap-2 rounded px-1.5 py-1.5 text-sm text-ash transition-colors duration-150 hover:text-optic"
    >
      <span className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center border transition-colors duration-150",
            multi ? "rounded-[3px]" : "rounded-full",
            active
              ? "border-brass bg-brass"
              : "border-steel-bright group-hover:border-ash",
          )}
        >
          {active && (
            <span
              className={cn(
                "block bg-obsidian",
                multi ? "size-2 rounded-[1px]" : "size-1.5 rounded-full",
              )}
            />
          )}
        </span>
        <span className={active ? "font-semibold text-optic" : undefined}>{label}</span>
      </span>
      {count !== undefined && <span className="font-mono text-xs text-ash-dim">{count}</span>}
    </Link>
  );
}

function PriceRangeForm({
  query,
  bounds,
}: {
  query: ProductQuery;
  bounds: { min: number; max: number };
}) {
  return (
    <form action="/magaza" method="GET" className="flex flex-col gap-3">
      {/* Görünmeyen diğer filtreler — form gönderildiğinde kaybolmasınlar. */}
      {query.q && <input type="hidden" name={PARAM.search} value={query.q} />}
      {query.category && <input type="hidden" name={PARAM.category} value={query.category} />}
      {query.brands?.map((slug) => (
        <input key={slug} type="hidden" name={PARAM.brands} value={slug} />
      ))}
      {query.inStockOnly && <input type="hidden" name={PARAM.inStockOnly} value="1" />}
      {query.sort && <input type="hidden" name={PARAM.sort} value={query.sort} />}

      <div className="flex items-center gap-3">
        <label className="flex-1">
          <span className="sr-only">En düşük fiyat</span>
          <input
            type="number"
            name={PARAM.minPrice}
            min={0}
            step={100}
            defaultValue={query.minPrice}
            placeholder={String(bounds.min)}
            className="w-full rounded border border-steel bg-obsidian px-3 py-2 text-sm text-optic placeholder:text-ash-dim focus:border-brass focus:outline-none"
          />
        </label>
        <span className="text-ash-dim" aria-hidden="true">
          —
        </span>
        <label className="flex-1">
          <span className="sr-only">En yüksek fiyat</span>
          <input
            type="number"
            name={PARAM.maxPrice}
            min={0}
            step={100}
            defaultValue={query.maxPrice}
            placeholder={String(bounds.max)}
            className="w-full rounded border border-steel bg-obsidian px-3 py-2 text-sm text-optic placeholder:text-ash-dim focus:border-brass focus:outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        className="rounded-full border border-steel py-2 font-display text-xs font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
      >
        Uygula
      </button>
    </form>
  );
}
