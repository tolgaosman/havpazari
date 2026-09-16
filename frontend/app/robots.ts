import type { MetadataRoute } from "next";
import { defaultSiteConfig } from "@/lib/site";

/**
 * `/admin` sonuca hiç düşmemeli — sayfa `robots: {index:false}` metadata'sı
 * zaten arama motorlarına "indeksleme" demiyor, ama tarayıcının kendisinin
 * o yolu hiç ziyaret etmesini de burada engelliyoruz.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${defaultSiteConfig.url}/sitemap.xml`,
  };
}
