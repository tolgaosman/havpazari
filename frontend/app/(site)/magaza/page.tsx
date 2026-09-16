import type { Metadata } from "next";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { EmptyState } from "@/components/shop/EmptyState";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { MobileFilterSheet } from "@/components/shop/MobileFilterSheet";
import { Pagination } from "@/components/shop/Pagination";
import { SortSelect } from "@/components/shop/SortSelect";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ProductCard } from "@/components/product/ProductCard";
import {
  getBrands,
  getCategories,
  getCategoryBySlug,
  getFilterOptions,
  getProducts,
  getSiteSettings,
} from "@/lib/api";
import { hasActiveFilters, parseProductQuery, type RawSearchParams } from "@/lib/searchParams";

interface ShopPageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const raw = await searchParams;
  const query = parseProductQuery(raw);
  const category = query.category ? await getCategoryBySlug(query.category) : null;

  const title = category ? category.name : query.q ? `"${query.q}" için sonuçlar` : "Mağaza";

  return {
    title,
    description:
      category?.description ??
      "Tüfek, optik, taktik giyim, kamp ve av aksesuarları — tüm ürünlerimiz.",
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const raw = await searchParams;
  const query = parseProductQuery(raw);

  const [result, options, categories, brands, settings] = await Promise.all([
    getProducts(query),
    getFilterOptions(query),
    getCategories(),
    getBrands(),
    getSiteSettings(),
  ]);

  const activeCategory = query.category
    ? categories.find((category) => category.slug === query.category)
    : null;

  return (
    <div className="container-page pb-24 pt-32 sm:pt-36">
      <header className="mb-10 flex flex-col gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
            {activeCategory ? activeCategory.tagline : "Tüm Ekipman"}
          </span>
          <h1 className="mt-1 text-display-md font-bold uppercase text-optic">
            {activeCategory ? activeCategory.name : query.q ? `"${query.q}"` : "Mağaza"}
          </h1>
          {activeCategory && (
            <p className="mt-2 max-w-2xl text-ash">{activeCategory.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-steel py-4">
          <p className="text-sm text-ash">
            <span className="font-semibold text-optic">{result.meta.total}</span> ürün
            {result.meta.total > 0 && (
              <>
                {" "}
                — {result.meta.from}–{result.meta.to} arası gösteriliyor
              </>
            )}
          </p>
          <div className="flex items-center gap-3">
            <MobileFilterSheet resultCount={result.meta.total}>
              <FilterPanel query={query} options={options} />
            </MobileFilterSheet>
            <SortSelect query={query} />
          </div>
        </div>

        <ActiveFilters query={query} categories={categories} brands={brands} />
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <FilterPanel query={query} options={options} />
          </div>
        </aside>

        <div className="flex flex-col gap-10">
          {result.data.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters(query)} settings={settings} />
          ) : (
            <Stagger immediate className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
              {result.data.map((product, index) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} priority={index < 4} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Pagination query={query} meta={result.meta} />
        </div>
      </div>
    </div>
  );
}
