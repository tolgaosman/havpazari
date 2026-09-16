import { WhatsAppGlyph } from "./SocialGlyphs";
import { whatsappHref, type SiteConfig } from "@/lib/site";

/** Her sayfada sağ altta sabit duran dairesel WhatsApp butonu. */
export function WhatsAppFloatingButton({ settings }: { settings: SiteConfig }) {
  return (
    <a
      href={whatsappHref(settings)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan yazın"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <WhatsAppGlyph className="size-7" />
    </a>
  );
}
