import type {
  ApiResponse,
  Brand,
  Category,
  Paginated,
  PriceRange,
  Product,
  ProductQuery,
} from "@/types";
import {
  DEFAULT_PER_PAGE,
  brandFacets,
  categoryFacets,
  filterProducts,
  paginate,
  priceRangeOf,
  relatedProducts,
  sortProducts,
  type Facet,
} from "./filters";
import { brands, categories, products } from "./mockData";
import { serializeProductQuery, shopHref } from "./searchParams";
import { defaultSiteConfig, type SiteConfig } from "./site";

/**
 * ════════════════════════════════════════════════════════════════════════
 *  VERİ ERİŞİM KATMANI
 * ════════════════════════════════════════════════════════════════════════
 *
 * Uygulamadaki TEK veri kapısı. Hiçbir bileşen `mockData`'yı doğrudan
 * import etmez; herkes buradaki fonksiyonları çağırır.
 *
 * Laravel API'ye geçiş:
 *   1. `.env.local` içine `NEXT_PUBLIC_API_URL=https://...` yaz.
 *   2. Hepsi bu. Aşağıdaki her fonksiyon otomatik olarak HTTP yoluna geçer.
 *
 * Dönüş tipleri Laravel API Resource / `paginate()` şekliyle eşleşecek
 * biçimde tasarlandı, böylece bileşenlerde tek satır değişmesi gerekmez.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

/** Gerçek backend devrede mi? Arayüzde "örnek veri" uyarısı için de kullanılıyor. */
export const isUsingLiveApi = Boolean(API_URL);

/** Ürün listeleri sık değişmez; 5 dakikalık önbellek makul. */
const REVALIDATE_SECONDS = 300;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Backend'e istek atar.
 *
 * Hata yutulmaz: 4xx/5xx durumunda `ApiError` fırlatılır ve en yakın
 * `error.tsx` sınırı devreye girer. Sessizce boş liste dönmek, veri
 * kaybını "sonuç bulunamadı" gibi göstereceği için kasıtlı olarak yapılmıyor.
 *
 * Tek istisna: `allowNotFound` verildiğinde 404 → `null`. Silinmiş bir ürün
 * hata sayfası değil, 404 sayfası göstermeli.
 */
async function apiFetch<T>(
  path: string,
  options: { allowNotFound?: boolean; tags?: string[] } = {},
): Promise<T | null> {
  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags: options.tags },
  });

  if (response.status === 404 && options.allowNotFound) return null;

  if (!response.ok) {
    throw new ApiError(
      `API isteği başarısız (${response.status}): ${path}`,
      response.status,
      path,
    );
  }

  return (await response.json()) as T;
}

// ---------------------------------------------------------------------------
// Ürünler
// ---------------------------------------------------------------------------

/** Filtrelenmiş, sıralanmış ve sayfalanmış ürün listesi. */
export async function getProducts(
  query: ProductQuery = {},
): Promise<Paginated<Product>> {
  if (API_URL) {
    const search = serializeProductQuery(query).toString();
    const result = await apiFetch<Paginated<Product>>(
      `/products${search ? `?${search}` : ""}`,
      { tags: ["catalog"] },
    );
    // Liste uç noktası 404 dönmez; `allowNotFound` verilmediği için null olamaz.
    return result as Paginated<Product>;
  }

  const filtered = filterProducts(products, query);
  const sorted = sortProducts(filtered, query.sort);
  const { items, meta } = paginate(
    sorted,
    query.page,
    query.perPage ?? DEFAULT_PER_PAGE,
  );

  return {
    data: items,
    meta,
    links: {
      first: shopHref({ ...query, page: 1 }),
      last: shopHref({ ...query, page: meta.lastPage }),
      prev: meta.currentPage > 1 ? shopHref({ ...query, page: meta.currentPage - 1 }) : null,
      next:
        meta.currentPage < meta.lastPage
          ? shopHref({ ...query, page: meta.currentPage + 1 })
          : null,
    },
  };
}

/** Tek ürün. Bulunamazsa `null` — çağıran taraf `notFound()` çağırır. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<Product>>(
      `/products/${encodeURIComponent(slug)}`,
      { allowNotFound: true, tags: ["catalog"] },
    );
    return result?.data ?? null;
  }

  return products.find((product) => product.slug === slug) ?? null;
}

/** Anasayfadaki öne çıkanlar rayı. */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<Product[]>>(
      `/products/featured?limit=${limit}`,
      { tags: ["catalog"] },
    );
    return result?.data ?? [];
  }

  const featured = products.filter((product) => product.isFeatured);
  return sortProducts(featured, "onerilen").slice(0, limit);
}

/** Ürün detayındaki "benzer ürünler" bölümü. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<Product[]>>(
      `/products/${encodeURIComponent(product.slug)}/related?limit=${limit}`,
      { tags: ["catalog"] },
    );
    return result?.data ?? [];
  }

  return relatedProducts(products, product, limit);
}

/** `generateStaticParams` için tüm ürün slug'ları. */
export async function getAllProductSlugs(): Promise<string[]> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<Array<{ slug: string }>>>(
      "/products/slugs",
      { tags: ["catalog"] },
    );
    return result?.data.map((item) => item.slug) ?? [];
  }

  return products.map((product) => product.slug);
}

// ---------------------------------------------------------------------------
// Kategoriler ve markalar
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<Category[]>>("/categories", { tags: ["catalog"] });
    return result?.data ?? [];
  }

  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<Category>>(
      `/categories/${encodeURIComponent(slug)}`,
      { allowNotFound: true, tags: ["catalog"] },
    );
    return result?.data ?? null;
  }

  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getBrands(): Promise<Brand[]> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<Brand[]>>("/brands", { tags: ["catalog"] });
    return result?.data ?? [];
  }

  return brands;
}

// ---------------------------------------------------------------------------
// Filtre seçenekleri
// ---------------------------------------------------------------------------

export interface FilterOptions {
  categories: Facet[];
  brands: Facet[];
  /** Kaydırıcının uçları — kataloğun tamamına göre, filtreden bağımsız. */
  priceRange: PriceRange;
  /** "Tüm Kategoriler" sayacı: kategori hariç diğer filtrelere uyan ürün sayısı. */
  totalProducts: number;
}

/**
 * Mağaza kenar çubuğunu besler.
 *
 * Sayaçlar mevcut sorguya göre hesaplanır: kullanıcı "Taktik Giyim" seçtiğinde
 * marka listesi o kategorideki markaların sayılarını gösterir.
 */
export async function getFilterOptions(
  query: ProductQuery = {},
): Promise<FilterOptions> {
  if (API_URL) {
    const search = serializeProductQuery(query).toString();
    const result = await apiFetch<ApiResponse<FilterOptions>>(
      `/products/filters${search ? `?${search}` : ""}`,
      { tags: ["catalog"] },
    );
    return (
      result?.data ?? {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
        totalProducts: 0,
      }
    );
  }

  return {
    categories: categoryFacets(products, query),
    brands: brandFacets(products, query),
    priceRange: priceRangeOf(products),
    totalProducts: filterProducts(products, query, "category").length,
  };
}

// ---------------------------------------------------------------------------
// İşletme bilgileri
// ---------------------------------------------------------------------------

/**
 * Telefon, adres, çalışma saatleri gibi işletme bilgileri — admin panelden
 * düzenlenir. Backend bağlı değilken `lib/site.ts`'teki statik varsayılana
 * düşer.
 */
export async function getSiteSettings(): Promise<SiteConfig> {
  if (API_URL) {
    const result = await apiFetch<ApiResponse<SiteConfig>>("/settings", { tags: ["settings"] });
    return result?.data ?? defaultSiteConfig;
  }

  return defaultSiteConfig;
}
