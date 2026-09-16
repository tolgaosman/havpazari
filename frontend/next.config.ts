import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * `script-src` içinde `'unsafe-inline'` var çünkü Next.js kendi bootstrap
 * script'lerini inline gömüyor. Bunu kaldırmanın tek yolu nonce üreten bir
 * `middleware.ts` eklemek; o da her sayfayı dinamik render'a zorlayıp statik
 * üretimi bitirir. Katalog sitesinde kullanıcı girdisi alan hiçbir sink
 * olmadığı için (form yok, dangerouslySetInnerHTML yok) bu takas bilinçli.
 * Backend eklenip form girdisi geldiğinde nonce'a geçilmeli.
 */
const isDev = process.env.NODE_ENV === "development";

// Laravel backend'in origin'i — admin panel ürün/kategori görselleri oradan
// servis edilir (`storage/` public disk). Tanımlı değilse (mock veri modu)
// hiçbir ek host eklenmez.
const backendOrigin = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
  : null;

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js'in geliştirme modundaki HMR/hata ayıklama araçları eval()
  // gerektirir (React: "will never use eval() in production mode").
  // Üretimde 'unsafe-eval' asla eklenmez.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://images.unsplash.com${backendOrigin ? ` ${backendOrigin}` : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${backendOrigin ? ` ${backendOrigin}` : ""}`,
  // İletişim sayfasındaki tıkla-yükle harita gömüsü.
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Görsel optimize edici, izin verilmeyen host'lara istek atmasın (SSRF yüzeyi).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...(backendOrigin
        ? [
            {
              protocol: new URL(backendOrigin).protocol.replace(":", "") as "http" | "https",
              hostname: new URL(backendOrigin).hostname,
              port: new URL(backendOrigin).port,
              pathname: "/storage/**",
            },
          ]
        : []),
    ],
    formats: ["image/avif", "image/webp"],
    // Next 16'nın SSRF koruması, çözümlenen IP loopback/özel ağdaysa
    // remotePatterns eşleşse bile isteği reddeder — yerel geliştirmede
    // backend genelde localhost'ta çalışır. Üretimde backend gerçek bir
    // hostname'de olacağı için bu yalnızca dev modunda açılıyor.
    dangerouslyAllowLocalIP: isDev,
  },

  // Admin panelin görsel yükleme server action'ları backend'in 8MB/dosya
  // sınırına yakın gövdeler gönderir — Next'in varsayılan 1MB sınırını aşar.
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
