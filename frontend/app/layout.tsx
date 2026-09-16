import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { defaultSiteConfig } from "@/lib/site";
import "./globals.css";

/**
 * Fontlar build zamanında indirilip self-host edilir (next/font) — üçüncü
 * taraf font isteği yok, CSP'de fonts.googleapis.com'a izin vermemize gerek
 * kalmıyor. `variable` çıktıları globals.css içindeki @theme'e bağlanıyor.
 */
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultSiteConfig.url),
  title: {
    default: `${defaultSiteConfig.name} — ${defaultSiteConfig.tagline}`,
    template: `%s — ${defaultSiteConfig.name}`,
  },
  description: defaultSiteConfig.description,
  keywords: [
    "av malzemeleri",
    "av tüfeği",
    "KKTC av",
    "Düzova",
    "Lefkoşa av dükkanı",
    "kamp malzemeleri",
    "taktik giyim",
    "dürbün",
  ],
  authors: [{ name: defaultSiteConfig.name }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: defaultSiteConfig.url,
    siteName: defaultSiteConfig.name,
    title: `${defaultSiteConfig.name} — ${defaultSiteConfig.tagline}`,
    description: defaultSiteConfig.description,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0c",
  colorScheme: "dark",
};

/**
 * Yalnızca html/body iskeleti, fontlar ve global hareket ayarı burada.
 * Üst menü/alt bilgi/JSON-LD gibi işletme verisine bağlı her şey
 * `app/(site)/layout.tsx`'te — böylece `/admin` bu kabuğu hiç yüklemez.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
