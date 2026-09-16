import { MapPin, Phone } from "lucide-react";
import { directionsHref, telHref, whatsappHref, type SiteConfig } from "@/lib/site";
import { WhatsAppGlyph } from "@/components/layout/SocialGlyphs";

interface ContactCtaProps {
  productName: string;
  sku: string;
  settings: SiteConfig;
}

/** Ürün detayındaki iletişim CTA satırı — katalog modunda sipariş yerine geçer. */
export function ContactCta({ productName, sku, settings }: ContactCtaProps) {
  const message = `Merhaba, "${productName}" (${sku}) hakkında bilgi almak istiyorum.`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={telHref(settings.contact.phone)}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brass px-6 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
      >
        <Phone className="size-4" />
        Mağazayı Ara
      </a>
      <a
        href={whatsappHref(settings, message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-steel px-6 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
      >
        <WhatsAppGlyph className="size-4" />
        WhatsApp&apos;tan Sor
      </a>
      <a
        href={directionsHref(settings)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 items-center justify-center gap-2 rounded-full border border-steel px-6 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
      >
        <MapPin className="size-4" />
        Yol Tarifi
      </a>
    </div>
  );
}
