import type {
  PaginationMeta,
  PriceRange,
  Product,
  ProductQuery,
  SortKey,
  StockStatus,
} from "@/types";

/**
 * Saf filtreleme / sıralama mantığı.
 *
 * Hiçbir fonksiyon girdisini değiştirmez ve dış dünyaya bakmaz — aynı girdi
 * her zaman aynı çıktıyı verir. Bu sayede statik üretimde (SSG) sonuç
 * deterministiktir ve mantık tek başına test edilebilir.
 */

/**
 * Türkçeye duyarlı arama normalizasyonu.
 *
 * "durbun" yazan kullanıcı "Dürbün"ü bulmalı. Adımlar:
 *   1. Türkçe yerel ayarla küçült  (İ → i, I → ı)
 *   2. NFD ile ayrıştır, birleşen işaretleri at  (ü → u, ş → s, ğ → g, ç → c, ö → o)
 *   3. Ayrıştırılamayan noktasız ı'yı i'ye eşle
 */
export function normalizeText(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
}

/** Ürünün aranabilir tüm metinleri tek dizide. */
function searchableText(product: Product): string {
  return normalizeText(
    [
      product.name,
      product.shortDescription,
      product.brand.name,
      product.category.name,
      product.sku,
      ...product.tags,
    ].join(" "),
  );
}

/**
 * Çok kelimeli aramada her kelime ayrı ayrı bulunmalı ("vortex durbun").
 * Kelime sırası önemsizdir.
 */
function matchesSearch(product: Product, rawQuery: string): boolean {
  const haystack = searchableText(product);
  return normalizeText(rawQuery)
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .every((term) => haystack.includes(term));
}

/** Rafta bulunabilirlik — "yalnızca stokta" filtresi bunu kullanır. */
function isAvailableNow(status: StockStatus): boolean {
  return status === "in_stock" || status === "low_stock";
}

/**
 * Fiyat filtresi.
 *
 * Fiyatı gizli ürünler (ruhsatlı silah, mühimmat) sayısal karşılaştırmaya
 * giremez. Kullanıcı bir fiyat aralığı seçtiyse bu ürünler kapsam dışı kalır —
 * "10.000 TL altı" diyen birine fiyatı bilinmeyen tüfek göstermek yanıltıcı olur.
 */
function matchesPrice(product: Product, query: ProductQuery): boolean {
  const hasPriceFilter =
    query.minPrice !== undefined || query.maxPrice !== undefined;
  if (!hasPriceFilter) return true;
  if (product.price === null) return false;

  if (query.minPrice !== undefined && product.price < query.minPrice) return false;
  if (query.maxPrice !== undefined && product.price > query.maxPrice) return false;
  return true;
}

/**
 * Tüm filtreleri uygular.
 *
 * `skip` ile bir boyut atlanabilir; kenar çubuğundaki sayaçlar (facet)
 * kendi boyutunu hariç tutarak sayar — böylece "Vortex (3)" yazarken
 * Vortex seçiliyken bile doğru sayıyı gösterir.
 */
export function filterProducts(
  products: readonly Product[],
  query: ProductQuery,
  skip?: "category" | "brands",
): Product[] {
  return products.filter((product) => {
    if (query.q && !matchesSearch(product, query.q)) return false;

    if (skip !== "category" && query.category && product.category.slug !== query.category) {
      return false;
    }

    if (
      skip !== "brands" &&
      query.brands?.length &&
      !query.brands.includes(product.brand.slug)
    ) {
      return false;
    }

    if (!matchesPrice(product, query)) return false;
    if (query.inStockOnly && !isAvailableNow(product.stockStatus)) return false;

    return true;
  });
}

/** "Önerilen" sıralamasında stok durumunun ağırlığı. Küçük olan önce gelir. */
const STOCK_RANK: Record<StockStatus, number> = {
  in_stock: 0,
  low_stock: 1,
  order_only: 2,
  out_of_stock: 3,
};

/** Fiyatı gizli ürünler fiyat sıralamasında her zaman en sona gider. */
function comparePrice(a: Product, b: Product, direction: 1 | -1): number {
  if (a.price === null && b.price === null) return 0;
  if (a.price === null) return 1;
  if (b.price === null) return -1;
  return (a.price - b.price) * direction;
}

const COMPARATORS: Record<SortKey, (a: Product, b: Product) => number> = {
  onerilen: (a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    const stockDiff = STOCK_RANK[a.stockStatus] - STOCK_RANK[b.stockStatus];
    if (stockDiff !== 0) return stockDiff;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  },
  "fiyat-artan": (a, b) => comparePrice(a, b, 1),
  "fiyat-azalan": (a, b) => comparePrice(a, b, -1),
  yeni: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  isim: (a, b) => a.name.localeCompare(b.name, "tr"),
};

/** Girdi dizisini değiştirmeden sıralar. */
export function sortProducts(
  products: readonly Product[],
  sort: SortKey = "onerilen",
): Product[] {
  return [...products].sort(COMPARATORS[sort]);
}

export const DEFAULT_PER_PAGE = 12;

export interface PaginatedSlice<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Sayfalama. İstenen sayfa aralığın dışındaysa son sayfaya kenetlenir —
 * elle `?sayfa=999` yazan kullanıcı boş ekranla karşılaşmaz.
 */
export function paginate<T>(
  items: readonly T[],
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): PaginatedSlice<T> {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(1, page), lastPage);
  const start = (currentPage - 1) * perPage;
  const slice = items.slice(start, start + perPage);

  return {
    items: slice,
    meta: {
      currentPage,
      lastPage,
      perPage,
      total,
      from: slice.length > 0 ? start + 1 : null,
      to: slice.length > 0 ? start + slice.length : null,
    },
  };
}

/**
 * Fiyat kaydırıcısının sınırları.
 * Fiyatı gizli ürünler hesaba katılmaz; hiç fiyatlı ürün yoksa 0–0 döner.
 */
export function priceRangeOf(products: readonly Product[]): PriceRange {
  const prices = products
    .map((product) => product.price)
    .filter((price): price is number => price !== null);

  if (prices.length === 0) return { min: 0, max: 0 };

  return {
    // En yakın 100'e yuvarla — kaydırıcıda 1.847 gibi bir sınır kötü görünür.
    min: Math.floor(Math.min(...prices) / 100) * 100,
    max: Math.ceil(Math.max(...prices) / 100) * 100,
  };
}

export interface Facet {
  slug: string;
  name: string;
  count: number;
}

/**
 * Marka sayaçları. Marka boyutu hariç tüm filtreler uygulanır, böylece
 * "Vortex (3)" yazısı Vortex seçiliyken de değişmez ve kullanıcı seçimini
 * genişletmenin ne getireceğini görebilir. Sayısı sıfır olan marka listelenmez.
 */
export function brandFacets(
  products: readonly Product[],
  query: ProductQuery,
): Facet[] {
  return countFacets(filterProducts(products, query, "brands"), (p) => ({
    slug: p.brand.slug,
    name: p.brand.name,
  }));
}

export function categoryFacets(
  products: readonly Product[],
  query: ProductQuery,
): Facet[] {
  return countFacets(filterProducts(products, query, "category"), (p) => ({
    slug: p.category.slug,
    name: p.category.name,
  }));
}

function countFacets(
  products: readonly Product[],
  pick: (product: Product) => { slug: string; name: string },
): Facet[] {
  const counts = new Map<string, Facet>();

  for (const product of products) {
    const { slug, name } = pick(product);
    const existing = counts.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(slug, { slug, name, count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

/**
 * Bir ürüne benzeyen diğer ürünler: önce aynı kategori, yetmezse aynı marka.
 * Ürünün kendisi hiçbir zaman listeye girmez.
 */
export function relatedProducts(
  products: readonly Product[],
  product: Product,
  limit = 4,
): Product[] {
  const others = products.filter((candidate) => candidate.id !== product.id);

  const sameCategory = others.filter(
    (candidate) => candidate.category.slug === product.category.slug,
  );
  const sameBrand = others.filter(
    (candidate) =>
      candidate.brand.slug === product.brand.slug &&
      candidate.category.slug !== product.category.slug,
  );

  return [...sortProducts(sameCategory), ...sortProducts(sameBrand)].slice(0, limit);
}
