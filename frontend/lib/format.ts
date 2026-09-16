import type { StockStatus } from "@/types";

/**
 * Formatter'lar modül düzeyinde bir kez kuruluyor.
 * `Intl.NumberFormat` örneği oluşturmak pahalı; her kart render'ında
 * yenisini yaratmak uzun listelerde hissedilir maliyet çıkarır.
 */
const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Fiyatı gösterir; fiyat gizliyse (ruhsatlı ürün) çağıran taraf bunu kullanmaz. */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

/** İndirim yüzdesi; geçersiz girdide `null` döner (0'a bölme ve negatif korumalı). */
export function discountPercent(
  price: number | null,
  compareAtPrice: number | null,
): number | null {
  if (price === null || compareAtPrice === null) return null;
  if (compareAtPrice <= 0 || price >= compareAtPrice) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

interface StockPresentation {
  label: string;
  /** Nokta göstergesinin Tailwind sınıfı. */
  dotClassName: string;
  textClassName: string;
}

const STOCK_PRESENTATION: Record<StockStatus, StockPresentation> = {
  in_stock: {
    label: "Mağazada mevcut",
    dotClassName: "bg-stock-in",
    textClassName: "text-stock-in",
  },
  low_stock: {
    label: "Son birkaç adet",
    dotClassName: "bg-stock-low",
    textClassName: "text-stock-low",
  },
  out_of_stock: {
    label: "Tükendi",
    dotClassName: "bg-stock-out",
    textClassName: "text-stock-out",
  },
  order_only: {
    label: "Siparişle temin edilir",
    dotClassName: "bg-ash",
    textClassName: "text-ash",
  },
};

export function stockPresentation(status: StockStatus): StockPresentation {
  return STOCK_PRESENTATION[status];
}

/** Uzun metni kelime ortasından kesmeden kısaltır. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}
