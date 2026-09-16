"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { defaultSiteConfig, telHref } from "@/lib/site";

/**
 * Rota sınırı hata yakalayıcı.
 *
 * `lib/api.ts`'deki `ApiError` (Laravel devreye girdiğinde) buraya düşer.
 * Hata detayı kullanıcıya gösterilmez — yalnızca konsola loglanır.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[hasan-av-dunyasi] rota hatası:", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[70dvh] flex-col items-center justify-center gap-6 pb-24 pt-32 text-center">
      <TriangleAlert className="size-12 text-blaze" aria-hidden="true" strokeWidth={1.5} />
      <div>
        <h1 className="text-display-md font-bold uppercase text-optic">Bir Şeyler Ters Gitti</h1>
        <p className="mt-3 max-w-md text-ash">
          Sayfa yüklenirken beklenmedik bir hata oluştu. Tekrar deneyin; devam
          ederse bizi arayabilirsiniz.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-full bg-brass px-6 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
        >
          Tekrar Dene
        </button>
        <a
          href={telHref(defaultSiteConfig.contact.phone)}
          className="inline-flex h-12 items-center justify-center rounded-full border border-steel px-6 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
        >
          {defaultSiteConfig.contact.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
