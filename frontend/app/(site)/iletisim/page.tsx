import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MapEmbed } from "@/components/layout/MapEmbed";
import { FacebookGlyph, WhatsAppGlyph } from "@/components/layout/SocialGlyphs";
import { getSiteSettings } from "@/lib/api";
import {
  directionsHref,
  formatHours,
  mapEmbedSrc,
  defaultSiteConfig,
  telHref,
  whatsappHref,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${defaultSiteConfig.name} adres, telefon ve çalışma saatleri — Düzova, KKTC.`,
  alternates: { canonical: "/iletisim" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page pb-24 pt-32 sm:pt-36">
      <Reveal immediate className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-brass">İletişim</span>
        <h1 className="mt-2 text-display-lg font-bold uppercase text-optic">Bize Ulaşın</h1>
        <p className="mt-4 text-lg text-ash">
          Sorularınız, sipariş öncesi merak ettikleriniz ya da mağazaya
          uğramadan önce stok teyidi için — bir telefon uzağınızdayız.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <Reveal immediate delay={0.05} className="flex flex-col gap-8">
          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-optic">
              Çalışma Saatleri
            </h2>
            <dl className="mt-3 flex flex-col gap-1.5 text-sm">
              {settings.openingHours.map((hour) => (
                <div key={hour.schemaDay} className="flex justify-between gap-4">
                  <dt className="text-ash">{hour.label}</dt>
                  <dd className="font-mono text-optic">{formatHours(hour)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ContactRow icon={MapPin} label="Adres">
            <p>{settings.address.full}</p>
            <a
              href={directionsHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-semibold text-brass hover:text-brass-bright"
            >
              Yol tarifi al →
            </a>
          </ContactRow>

          <ContactRow icon={Phone} label="Telefon">
            <a href={telHref(settings.contact.phone)} className="hover:text-brass">
              {settings.contact.phoneDisplay}
            </a>
          </ContactRow>

          <ContactRow icon={WhatsAppGlyph} label="WhatsApp">
            <a
              href={whatsappHref(settings, "Merhaba, bir sorum vardı.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brass"
            >
              {settings.contact.mobileDisplay}
            </a>
          </ContactRow>

          {settings.social.facebook && (
            <ContactRow icon={FacebookGlyph} label="Facebook">
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brass"
              >
                Sayfamızı takip edin
              </a>
            </ContactRow>
          )}
        </Reveal>

        <Reveal immediate delay={0.1} className="min-h-[24rem] overflow-hidden rounded-lg border border-steel lg:min-h-0">
          <MapEmbed
            src={mapEmbedSrc(settings)}
            title={`${settings.name} konumu`}
            className="size-full min-h-[24rem] grayscale-[20%] lg:min-h-full"
          />
        </Reveal>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-steel text-brass">
        <Icon className="size-4" aria-hidden={true} />
      </span>
      <div>
        {/* Alan etiketi — gerçek bir bölüm başlığı değil, `<h2>` yerine
            görsel olarak aynı ama başlık ağacına gürültü katmayan bir `<p>`. */}
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-optic">
          {label}
        </p>
        <div className="mt-1 text-sm text-ash">{children}</div>
      </div>
    </div>
  );
}
