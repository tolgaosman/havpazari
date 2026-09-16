import { z } from "zod";
import { SORT_KEYS, type ProductQuery } from "@/types";

/**
 * URL arama parametreleri ⇄ ProductQuery dönüşümü.
 *
 * Filtre durumunun tek kaynağı URL'dir: global state yok, Context yok.
 * Sayfa yenilendiğinde, link paylaşıldığında, geri tuşuna basıldığında
 * sonuç aynı kalır — ve bu query string ileride Laravel'e olduğu gibi gider.
 *
 * GÜVENLİK: Buraya gelen her şey kullanıcı kontrolünde. Hiçbir değer
 * doğrulanmadan aşağı katmana geçmez; şemaya uymayan değer sessizce düşürülür,
 * hata fırlatılmaz (bozuk bir link sayfayı çökertmemeli).
 */

/** URL'de görünen parametre adları — tek yerden yönetiliyor. */
export const PARAM = {
  search: "ara",
  category: "kategori",
  brands: "marka",
  minPrice: "min",
  maxPrice: "max",
  inStockOnly: "stok",
  sort: "sirala",
  page: "sayfa",
} as const;

/** Next.js'in sayfa bileşenine verdiği ham arama parametresi tipi. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Slug'lar yalnızca küçük harf, rakam ve tire içerebilir. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Serbest metin aramasında üst sınır — aşırı uzun girdi reddedilir. */
const MAX_SEARCH_LENGTH = 80;

/** Fiyat filtresinin kabul ettiği mutlak sınırlar (TL). */
const PRICE_CEILING = 1_000_000;

const slugSchema = z.string().regex(SLUG_PATTERN).optional().catch(undefined);

/** Boş ya da geçersiz sayısal girdiyi `undefined`'a çevirir; NaN sızdırmaz. */
const priceSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() !== "" ? Number(value) : undefined,
  z.number().finite().min(0).max(PRICE_CEILING).optional().catch(undefined),
);

const pageSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() !== "" ? Number(value) : undefined,
  z.number().int().min(1).max(500).optional().catch(undefined),
);

const productQuerySchema = z.object({
  q: z.string().trim().min(1).max(MAX_SEARCH_LENGTH).optional().catch(undefined),
  category: slugSchema,
  brands: z.array(z.string().regex(SLUG_PATTERN)).optional().catch(undefined),
  minPrice: priceSchema,
  maxPrice: priceSchema,
  inStockOnly: z.boolean().optional().catch(undefined),
  sort: z.enum(SORT_KEYS).optional().catch(undefined),
  page: pageSchema,
});

/** Bir parametrenin ilk değerini alır; Next aynı anahtarı dizi olarak verebilir. */
function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Markalar `marka=vortex,petzl` biçiminde virgülle ayrılır.
 * Tekrarlı anahtar (`marka=a&marka=b`) da desteklenir.
 */
function parseBrands(value: string | string[] | undefined): string[] | undefined {
  const raw = Array.isArray(value) ? value : value === undefined ? [] : [value];
  const slugs = raw
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && SLUG_PATTERN.test(entry));

  if (slugs.length === 0) return undefined;
  // Yinelenenleri at — aynı marka iki kez sayılmasın.
  return [...new Set(slugs)];
}

/** Ham arama parametrelerini doğrulanmış bir `ProductQuery`'ye çevirir. */
export function parseProductQuery(raw: RawSearchParams): ProductQuery {
  const inStockRaw = first(raw[PARAM.inStockOnly]);

  const parsed = productQuerySchema.safeParse({
    q: first(raw[PARAM.search]),
    category: first(raw[PARAM.category]),
    brands: parseBrands(raw[PARAM.brands]),
    minPrice: first(raw[PARAM.minPrice]),
    maxPrice: first(raw[PARAM.maxPrice]),
    inStockOnly: inStockRaw === "1" ? true : undefined,
    sort: first(raw[PARAM.sort]),
    page: first(raw[PARAM.page]),
  });

  // `.catch()` sayesinde tekil alanlar zaten düşürülüyor; buraya düşmek
  // yalnızca şemanın tamamı bozulursa mümkün. Boş sorgu güvenli varsayılandır.
  if (!parsed.success) return {};

  const query = parsed.data;

  // Kullanıcı min > max yazmışsa değerleri takas et; sonuç boş dönmesin.
  if (
    query.minPrice !== undefined &&
    query.maxPrice !== undefined &&
    query.minPrice > query.maxPrice
  ) {
    return { ...query, minPrice: query.maxPrice, maxPrice: query.minPrice };
  }

  return query;
}

/**
 * `ProductQuery`'yi URL arama parametrelerine çevirir.
 * Varsayılan/boş değerler yazılmaz — URL temiz kalır.
 */
export function serializeProductQuery(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.q) params.set(PARAM.search, query.q);
  if (query.category) params.set(PARAM.category, query.category);
  if (query.brands?.length) params.set(PARAM.brands, query.brands.join(","));
  if (query.minPrice !== undefined) params.set(PARAM.minPrice, String(query.minPrice));
  if (query.maxPrice !== undefined) params.set(PARAM.maxPrice, String(query.maxPrice));
  if (query.inStockOnly) params.set(PARAM.inStockOnly, "1");
  if (query.sort && query.sort !== "onerilen") params.set(PARAM.sort, query.sort);
  if (query.page !== undefined && query.page > 1) params.set(PARAM.page, String(query.page));

  return params;
}

/** `/magaza` için tam href üretir; parametre yoksa sade yolu döner. */
export function shopHref(query: ProductQuery): string {
  const params = serializeProductQuery(query);
  const search = params.toString();
  return search ? `/magaza?${search}` : "/magaza";
}

/**
 * Mevcut sorgunun üzerine kısmi değişiklik uygular.
 * Filtre değiştiğinde sayfa 1'e döner — aksi halde kullanıcı boş sayfada kalır.
 */
export function withQueryChange(
  current: ProductQuery,
  change: Partial<ProductQuery>,
): ProductQuery {
  const next: ProductQuery = { ...current, ...change };
  const onlyPageChanged =
    Object.keys(change).length === 1 && "page" in change;
  if (!onlyPageChanged) delete next.page;
  return next;
}

/**
 * Marka listesinde tek bir markayı ekler/çıkarır, diğer seçili markaları korur.
 * Kenar çubuğundaki marka linkleri bunu kullanır.
 */
export function toggleBrand(current: ProductQuery, slug: string): ProductQuery {
  const selected = current.brands ?? [];
  const nextBrands = selected.includes(slug)
    ? selected.filter((brand) => brand !== slug)
    : [...selected, slug];

  return withQueryChange(current, {
    brands: nextBrands.length > 0 ? nextBrands : undefined,
  });
}

/** Kullanıcı gerçekten bir filtre uyguladı mı? (Boş durum metnini seçmek için.) */
export function hasActiveFilters(query: ProductQuery): boolean {
  return Boolean(
    query.q ||
      query.category ||
      query.brands?.length ||
      query.minPrice !== undefined ||
      query.maxPrice !== undefined ||
      query.inStockOnly,
  );
}
