import type { Category } from "@/types";

export interface NavLink {
  label: string;
  href: string;
}

/**
 * Kategori listesinden mağaza dropdown'ının bağlantılarını üretir.
 *
 * Kategoriler `getCategories()` üzerinden (bkz. lib/api.ts) sunucu tarafında
 * çekilip Navbar'a prop olarak geçiriliyor — istemci bileşeni mock veriye
 * doğrudan erişmiyor.
 */
export function categoryNavLinks(categories: Category[]): NavLink[] {
  return categories.map((category) => ({
    label: category.name,
    href: `/magaza?kategori=${category.slug}`,
  }));
}

export const staticNav: NavLink[] = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];
