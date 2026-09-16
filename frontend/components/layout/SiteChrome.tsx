import type { Category } from "@/types";
import type { SiteConfig } from "@/lib/site";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { SkipLink } from "./SkipLink";
import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";

interface SiteChromeProps {
  categories: Category[];
  settings: SiteConfig;
  children: React.ReactNode;
}

/**
 * Site kabuğu — üst menü, alt bilgi ve WhatsApp düğmesi. `app/(site)/layout.tsx`
 * bunu her sayfada kullanır. Kök `app/not-found.tsx` da aynısını kullanır:
 * 404 rotası hiçbir segmentle eşleşmediği için `(site)` grubunun layout'u
 * devreye girmez, kabuğu kendisi kurmak zorundadır.
 */
export function SiteChrome({ categories, settings, children }: SiteChromeProps) {
  return (
    <>
      <SkipLink />
      <Navbar categories={categories} settings={settings} />
      <main id="ana-icerik">{children}</main>
      <Footer categories={categories} settings={settings} />
      <WhatsAppFloatingButton settings={settings} />
    </>
  );
}
