import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppGlyph } from "@/components/layout/SocialGlyphs";
import { editorialImages } from "@/lib/mockData";
import {
  directionsHref,
  summarizeOpeningHours,
  telHref,
  whatsappHref,
  type SiteConfig,
} from "@/lib/site";

export function StoreStrip({ settings }: { settings: SiteConfig }) {
  return (
    <section className="border-t border-steel bg-charcoal">
      <div className="container-page grid grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
        <Reveal className="relative order-2 min-h-[20rem] overflow-hidden lg:order-1 lg:min-h-0">
          <Image
            src={editorialImages.storeInterior.url}
            alt={editorialImages.storeInterior.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent lg:bg-gradient-to-r" />
        </Reveal>

        <Reveal
          delay={0.1}
          className="order-1 flex flex-col justify-center gap-8 py-16 sm:py-20 lg:order-2 lg:pl-16"
        >
          <div className="flex flex-col gap-3">
            <span className="rule-brass w-16" aria-hidden="true" />
            <h2 className="text-display-md font-bold uppercase text-optic">
              Elden Görün, Elinize Alın
            </h2>
            <p className="max-w-md text-ash">
              Sitede gördüğünüz her ürün Düzova&apos;daki mağazamızda elle
              muayene edilip denenebilir. Ruhsatlı ürünlerde satış yalnızca
              mağazada, belge karşılığında yapılır.
            </p>
          </div>

          <dl className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brass" aria-hidden="true" />
              <div>
                <dt className="font-display text-xs font-bold uppercase tracking-wide text-optic">
                  Adres
                </dt>
                <dd className="text-sm text-ash">{settings.address.full}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-brass" aria-hidden="true" />
              <div>
                <dt className="font-display text-xs font-bold uppercase tracking-wide text-optic">
                  Çalışma Saatleri
                </dt>
                <dd className="text-sm text-ash">
                  {summarizeOpeningHours(settings).map((group) => (
                    <span key={group.label} className="block">
                      {group.label}: {group.hours}
                    </span>
                  ))}
                </dd>
              </div>
            </div>
          </dl>

          <div className="flex flex-wrap gap-4">
            <a
              href={telHref(settings.contact.phone)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brass px-6 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
            >
              <Phone className="size-4" />
              Ara
            </a>
            <a
              href={whatsappHref(settings, "Merhaba, mağazanız hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-steel px-6 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
            >
              <WhatsAppGlyph className="size-4" />
              WhatsApp
            </a>
            <a
              href={directionsHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-steel px-6 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
            >
              <MapPin className="size-4" />
              Yol Tarifi
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
