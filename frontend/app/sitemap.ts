import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/api";
import { defaultSiteConfig } from "@/lib/site";

/**
 * Statik sayfalar + tüm ürün ve kategori URL'leri. Ürün/kategori sayısı
 * arttıkça bu dosyaya dokunmaya gerek yok — `lib/api.ts` üzerinden otomatik
 * büyür (mock veya canlı API, ikisinde de çalışır).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = defaultSiteConfig.url;
  const now = new Date();

  const [slugs, categories] = await Promise.all([getAllProductSlugs(), getCategories()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/magaza`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/hakkimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/magaza?kategori=${category.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/urun/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
