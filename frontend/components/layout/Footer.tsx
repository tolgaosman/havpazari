import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { FacebookGlyph } from "./SocialGlyphs";
import { isUsingLiveApi } from "@/lib/api";
import {
  directionsHref,
  formatHours,
  telHref,
  whatsappHref,
  type SiteConfig,
} from "@/lib/site";
import type { Category } from "@/types";

interface FooterProps {
  categories: Category[];
  settings: SiteConfig;
}

export function Footer({ categories, settings }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="grain border-t border-steel bg-charcoal">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container-page relative py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Marka + adres */}
          <div className="flex flex-col gap-5">
            <Logo siteName={settings.name} />
            <p className="max-w-xs text-sm leading-relaxed text-ash">
              {settings.description}
            </p>
            <div className="flex items-center gap-3">
              {settings.social.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook'ta takip edin"
                  className="flex size-9 items-center justify-center rounded-full border border-steel text-ash transition-colors duration-200 hover:border-brass hover:text-brass"
                >
                  <FacebookGlyph className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Kategoriler */}
          <nav aria-label="Kategoriler">
            <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-optic">
              Kategoriler
            </h3>
            <ul className="flex flex-col gap-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/magaza?kategori=${category.slug}`}
                    className="text-sm text-ash transition-colors duration-200 hover:text-brass"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hızlı linkler */}
          <nav aria-label="Hızlı bağlantılar">
            <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-optic">
              Kurumsal
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/magaza" className="text-sm text-ash transition-colors duration-200 hover:text-brass">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-sm text-ash transition-colors duration-200 hover:text-brass">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-ash transition-colors duration-200 hover:text-brass">
                  İletişim
                </Link>
              </li>
            </ul>
          </nav>

          {/* İletişim */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-optic">
                Mağaza
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-ash">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden="true" />
                  <a
                    href={directionsHref(settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-brass"
                  >
                    {settings.address.full}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-brass" aria-hidden="true" />
                  <a href={telHref(settings.contact.phone)} className="transition-colors duration-200 hover:text-brass">
                    {settings.contact.phoneDisplay}
                  </a>
                </li>
              </ul>
              <ul className="mt-4 space-y-1 text-xs text-ash-dim">
                {settings.openingHours.map((hour) => (
                  <li key={hour.schemaDay} className="flex justify-between gap-4">
                    <span>{hour.label}</span>
                    <span className="font-mono">{formatHours(hour)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-steel pt-8 text-xs text-ash-dim sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p>
              © {year} {settings.name}. Tüm hakları saklıdır.
            </p>
            {!isUsingLiveApi && <p>Ürün, fiyat ve stok bilgileri örnek veridir.</p>}
          </div>
          <a
            href={whatsappHref(settings, "Merhaba, bir ürün hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brass transition-colors duration-200 hover:text-brass-bright"
          >
            WhatsApp&apos;tan yazın →
          </a>
        </div>
      </div>
    </footer>
  );
}
