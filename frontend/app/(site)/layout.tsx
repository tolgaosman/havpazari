import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCategories, getSiteSettings } from "@/lib/api";
import type { SiteConfig } from "@/lib/site";

/** Anasayfada gösterilen LocalBusiness yapılandırılmış verisi. */
function localBusinessJsonLd(settings: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "SportingGoodsStore",
    name: settings.name,
    description: settings.description,
    url: settings.url,
    telephone: settings.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.locality,
      addressRegion: settings.address.region,
      addressCountry: settings.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.geo.latitude,
      longitude: settings.geo.longitude,
    },
    openingHoursSpecification: settings.openingHours
      .filter((hour) => hour.opens !== null && hour.closes !== null)
      .map((hour) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${
          {
            Mo: "Monday",
            Tu: "Tuesday",
            We: "Wednesday",
            Th: "Thursday",
            Fr: "Friday",
            Sa: "Saturday",
            Su: "Sunday",
          }[hour.schemaDay]
        }`,
        opens: hour.opens,
        closes: hour.closes,
      })),
    sameAs: [settings.social.facebook].filter(
      (href) => href && !href.endsWith(".com/"),
    ),
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify çıktısı; kullanıcı girdisi içermez.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(settings)) }}
      />
      <SiteChrome categories={categories} settings={settings}>
        {children}
      </SiteChrome>
    </>
  );
}
