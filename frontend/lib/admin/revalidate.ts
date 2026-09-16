import { revalidateTag } from "next/cache";

/**
 * Admin bir ürün/kategori/marka değiştirdiğinde çağrılır — sitedeki
 * `lib/api.ts` katalog istekleri (`tags: ["catalog"]`) yeniden doğrulanır.
 * `updateTag` değil `revalidateTag` kullanıyoruz: panel ve site ayrı
 * request'ler, "read-your-own-writes" burada gerekmiyor.
 */
export function revalidateCatalog(): void {
  revalidateTag("catalog", "max");
}

/** Ayarlar güncellendiğinde footer/iletişim/WhatsApp linkleri tazelensin diye. */
export function revalidateSettings(): void {
  revalidateTag("settings", "max");
}
