import { ImageResponse } from "next/og";
import { defaultSiteConfig } from "@/lib/site";

/**
 * Kök seviye paylaşım görseli — kendi `openGraph.images`'ını tanımlamayan
 * her rota (anasayfa, mağaza, iletişim, hakkımızda) bunu miras alır.
 * Ürün sayfası kendi görselini `generateMetadata` içinde ayrıca tanımlıyor.
 */
export const alt = defaultSiteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#100f0a",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(173,138,78,0.16), transparent 55%)",
        }}
      >
        <svg width={96} height={96} viewBox="0 0 24 24" fill="none" stroke="#c7a468" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="10" />
          <line x1="22" x2="18" y1="12" y2="12" />
          <line x1="6" x2="2" y1="12" y2="12" />
          <line x1="12" x2="12" y1="6" y2="2" />
          <line x1="12" x2="12" y1="22" y2="18" />
        </svg>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "#f2ede0",
            textTransform: "uppercase",
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          {defaultSiteConfig.name}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#ad8a4e",
            textTransform: "uppercase",
            letterSpacing: 6,
          }}
        >
          {defaultSiteConfig.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
