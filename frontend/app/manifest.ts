import type { MetadataRoute } from "next";
import { defaultSiteConfig } from "@/lib/site";

/**
 * PWA/"ana ekrana ekle" için minimum manifest. Site bir uygulama değil ama
 * bu dosya olmadan iOS/Android "ana ekrana ekle" akışı isim/simge/tema
 * rengi olmadan çıplak bir yer imi oluşturuyor.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: defaultSiteConfig.name,
    short_name: defaultSiteConfig.shortName,
    description: defaultSiteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#100f0a",
    theme_color: "#100f0a",
    lang: "tr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
