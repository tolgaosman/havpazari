import Link from "next/link";
import { Compass } from "lucide-react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCategories, getSiteSettings } from "@/lib/api";
import { telHref } from "@/lib/site";

/**
 * 404 rotası hiçbir segmentle eşleşmediği için `app/(site)/layout.tsx`
 * devreye girmez — kabuğu (üst menü/alt bilgi) burada kendimiz kuruyoruz.
 */
export default async function NotFound() {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);

  return (
    <SiteChrome categories={categories} settings={settings}>
      <div className="container-page flex min-h-[70dvh] flex-col items-center justify-center gap-6 pb-24 pt-32 text-center">
        <Compass className="size-12 text-brass" aria-hidden="true" strokeWidth={1.5} />
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-ash-dim">Hata 404</p>
          <h1 className="mt-2 text-display-md font-bold uppercase text-optic">Rota Bulunamadı</h1>
          <p className="mt-3 max-w-md text-ash">
            Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir.
            Mağazamıza göz atın ya da bizi arayın.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/magaza"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brass px-6 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
          >
            Mağazaya Dön
          </Link>
          <a
            href={telHref(settings.contact.phone)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-steel px-6 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
          >
            {settings.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </SiteChrome>
  );
}
