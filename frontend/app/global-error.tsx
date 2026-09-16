"use client";

import { useEffect } from "react";
import { defaultSiteConfig, telHref } from "@/lib/site";

/**
 * Kök `layout.tsx`'in KENDİSİ hata verirse devreye giren son çare sınırı.
 * `(site)/error.tsx` yalnızca `(site)` grubunun içindeki hataları yakalar;
 * kök layout (fontlar, `MotionConfig`) patlarsa oraya hiç düşülmez — bu
 * dosya kendi `<html>`/`<body>`'sini kurmak zorunda çünkü kökün yerini alıyor.
 *
 * Burada `next/font`, motion veya globals.css'e güvenilmiyor: kök zaten
 * çökmüş olabilir, bu yüzden düz sistem fontu ve enline stil kullanılıyor.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[hasan-av-dunyasi] kök hata:", error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#100f0a",
          color: "#f2ede0",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, textTransform: "uppercase" }}>
            Bir Şeyler Ters Gitti
          </h1>
          <p style={{ marginTop: "0.75rem", maxWidth: "28rem", color: "#a89e87" }}>
            Sayfa yüklenirken beklenmedik bir hata oluştu. Tekrar deneyin; devam
            ederse bizi arayabilirsiniz.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              height: "3rem",
              padding: "0 1.5rem",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "#ad8a4e",
              color: "#100f0a",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              cursor: "pointer",
            }}
          >
            Tekrar Dene
          </button>
          <a
            href={telHref(defaultSiteConfig.contact.phone)}
            style={{
              height: "3rem",
              padding: "0 1.5rem",
              borderRadius: "9999px",
              border: "1px solid #3a3320",
              color: "#f2ede0",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            {defaultSiteConfig.contact.phoneDisplay}
          </a>
        </div>
      </body>
    </html>
  );
}
