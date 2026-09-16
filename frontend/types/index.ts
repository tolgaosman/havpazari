/**
 * Hasan Av Dünyası — alan modeli.
 *
 * Bu tipler Laravel API Resource'larının döneceği JSON şekliyle birebir
 * eşleşecek biçimde tasarlandı. Backend geldiğinde bu dosya değişmez;
 * yalnızca lib/api.ts içindeki veri kaynağı değişir.
 */

/** Tek para birimi kullanıyoruz; yanlışlıkla başka bir kod yazılmasın. */
export type Currency = "TRY";

export type StockStatus =
  /** Rafta var. */
  | "in_stock"
  /** Son birkaç adet. */
  | "low_stock"
  /** Tükendi. */
  | "out_of_stock"
  /** Stokta tutulmuyor, siparişle getiriliyor. */
  | "order_only";

/**
 * Ürün listelerinde ve filtrelerde kullanılan sıralama anahtarları.
 * Değerler doğrudan URL'de görünür, o yüzden Türkçe ve ASCII.
 */
export type SortKey =
  | "onerilen"
  | "fiyat-artan"
  | "fiyat-azalan"
  | "yeni"
  | "isim";

export const SORT_KEYS = [
  "onerilen",
  "fiyat-artan",
  "fiyat-azalan",
  "yeni",
  "isim",
] as const satisfies readonly SortKey[];

export interface Brand {
  id: string;
  name: string;
  /** URL'de kullanılan ASCII kimlik, ör. "hatsan". */
  slug: string;
  /** Markanın menşei, ürün föyünde gösterilir. */
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  /** Kategori kartındaki tek satırlık tanıtım metni. */
  tagline: string;
  /** Kategori sayfası başlığının altındaki açıklama. */
  description: string;
  imageUrl: string;
  imageAlt: string;
}

/**
 * Ürün üzerinde gömülü gelen daraltılmış kategori/marka gösterimi
 * (Laravel tarafında eager-loaded ilişkinin karşılığı).
 */
export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface BrandRef {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  url: string;
  /** Boş bırakılamaz — a11y için zorunlu. */
  alt: string;
}

/** Ürün detayındaki teknik föyün tek satırı. */
export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  /** Mağaza içi stok kodu; ürün föyünde mono fontla gösterilir. */
  sku: string;
  name: string;
  slug: string;
  /** Kartta görünen kısa tanıtım (maks. ~90 karakter). */
  shortDescription: string;
  /** Ürün detayındaki uzun açıklama. */
  description: string;
  /**
   * Vitrin fiyatı (TL).
   *
   * `null` ise fiyat sitede gösterilmez, "Fiyat için arayın" yazılır.
   * Ruhsata tabi ürünlerde bilinçli olarak `null` bırakılır.
   */
  price: number | null;
  /** İndirim öncesi fiyat; yoksa `null`. */
  compareAtPrice: number | null;
  currency: Currency;
  category: CategoryRef;
  brand: BrandRef;
  /** En az bir görsel bulunur; ilki kapak görselidir. */
  images: ProductImage[];
  specs: ProductSpec[];
  stockStatus: StockStatus;
  /**
   * Ateşli silah ve mühimmat gibi ruhsata tabi ürünler.
   * `true` ise arayüz online satış yapılmadığını açıkça belirtir.
   */
  requiresLicense: boolean;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  /** ISO 8601 tarih; "yeni" sıralaması bunu kullanır. */
  createdAt: string;
}

/** Ürün listeleme sorgusu. Alanlar URL arama parametrelerinden türetilir. */
export interface ProductQuery {
  /** Serbest metin araması: ad, kısa açıklama, marka, etiketler. */
  q?: string;
  /** Kategori slug'ı. */
  category?: string;
  /** Marka slug'ları (çoklu seçim). */
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  /** Yalnızca rafta olanları göster. */
  inStockOnly?: boolean;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

/**
 * Laravel'in `paginate()` çıktısının şekli.
 * Mock katmanı da aynısını üretir ki geçişte bileşenler değişmesin.
 */
export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  /** Bu sayfadaki ilk kaydın 1 tabanlı sırası; sonuç boşsa `null`. */
  from: number | null;
  to: number | null;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

/** Tekil kaynak dönüşü (Laravel `JsonResource`). */
export interface ApiResponse<T> {
  data: T;
}

/** Fiyat aralığı kaydırıcısının sınırlarını besler. */
export interface PriceRange {
  min: number;
  max: number;
}
