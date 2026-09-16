/**
 * İşletme bilgilerinin şekli + statik varsayılan değerler.
 *
 * Gerçek değerler artık admin panelden düzenlenip backend'deki `settings`
 * tablosunda tutuluyor (`lib/api.ts` → `getSiteSettings()`). Buradaki
 * `defaultSiteConfig`, backend bağlı değilken (mock veri modu) ve hata/404
 * sınırları gibi API'ye güvenmek istemediğimiz yerlerde kullanılan sabit
 * yedektir — admin panelden yapılan değişiklikler bu dosyayı etkilemez.
 *
 * ⚠️ Kasıtlı olarak `contact.email` alanı YOK. Site hiçbir yerde satıcı
 * e-postası göstermez — iletişim yalnızca telefon, WhatsApp ve mağaza.
 */

export interface OpeningHour {
  /** schema.org kısaltması — JSON-LD'de kullanılıyor. */
  schemaDay: "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";
  label: string;
  /** "HH:MM" biçiminde; kapalıysa `null`. */
  opens: string | null;
  closes: string | null;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  contact: {
    phone: string;
    phoneDisplay: string;
    mobile: string;
    mobileDisplay: string;
  };
  address: {
    street: string;
    locality: string;
    region: string;
    country: string;
    countryCode: string;
    plusCode: string;
    full: string;
  };
  mapsUrl: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: OpeningHour[];
  social: {
    facebook: string;
    instagram: string;
  };
  announcements: string[];
}

export const defaultSiteConfig: SiteConfig = {
  name: "Hasan Av Dünyası",
  shortName: "Hasan Av",
  tagline: "Av, Doğa ve Kamp Ekipmanları",
  description:
    "Düzova'da 20 yıldır avcının yanında. Tüfek, optik, taktik giyim, kamp ve hayatta kalma ekipmanları — hepsi elden görülüp denenebilir.",

  url: "https://hasanavdunyasi.com",

  contact: {
    phone: "+90 542 850 73 44",
    phoneDisplay: "0542 850 73 44",
    mobile: "+90 542 850 73 44",
    mobileDisplay: "0542 850 73 44",
  },

  address: {
    street: "Lefkoşa İskele Anayolu",
    locality: "Düzova",
    region: "Değirmenlik, Lefkoşa",
    country: "Kuzey Kıbrıs Türk Cumhuriyeti",
    countryCode: "CY",
    plusCode: "6GHJ+49G Düzova",
    full: "Lefkoşa İskele Anayolu, Düzova, Lefkoşa, KKTC",
  },

  mapsUrl:
    "https://www.google.com/maps/place//data=!4m2!3m1!1s0x14de3907ce7fd31d:0x918946cf4da040fe",

  geo: {
    latitude: 35.227815,
    longitude: 33.5309577,
  },

  openingHours: [
    { schemaDay: "Mo", label: "Pazartesi", opens: "09:30", closes: "18:00" },
    { schemaDay: "Tu", label: "Salı", opens: "09:30", closes: "18:00" },
    { schemaDay: "We", label: "Çarşamba", opens: "09:30", closes: "18:00" },
    { schemaDay: "Th", label: "Perşembe", opens: "09:30", closes: "18:00" },
    { schemaDay: "Fr", label: "Cuma", opens: "09:30", closes: "18:00" },
    { schemaDay: "Sa", label: "Cumartesi", opens: "09:30", closes: "18:00" },
    { schemaDay: "Su", label: "Pazar", opens: null, closes: null },
  ],

  social: {
    facebook: "https://www.facebook.com/p/Hasan-Av-D%C3%BCnyas%C4%B1%C4%B1-61564920326191/",
    instagram: "",
  },

  announcements: [
    "Düzova'da elden teslim — ürünü görmeden almak zorunda değilsiniz",
    "Av sezonu hazırlığı: yeni gelen optik ve kamuflaj ürünleri mağazada",
    "Ruhsatlı ürünler yalnızca mağazadan, belge ile satılır",
  ],
};

/** `tel:` bağlantıları için boşluksuz numara. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/**
 * WhatsApp bağlantısı. Numaradaki `+` ve boşluklar wa.me biçimine göre
 * temizlenir; ön yazı varsa URL-encode edilir.
 */
export function whatsappHref(config: SiteConfig, message?: string): string {
  const number = config.contact.mobile.replace(/[^\d]/g, "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Google Maps yol tarifi bağlantısı (koordinat üzerinden, isim yazım hatasına bağlı değil). */
export function directionsHref(config: SiteConfig): string {
  const { latitude, longitude } = config.geo;
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

/** İletişim sayfasındaki tıkla-yükle harita gömüsünün kaynağı. */
export function mapEmbedSrc(config: SiteConfig): string {
  const { latitude, longitude } = config.geo;
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;
}

/** "08:30 – 18:30" ya da "Kapalı". */
export function formatHours(hour: OpeningHour): string {
  if (hour.opens === null || hour.closes === null) return "Kapalı";
  return `${hour.opens} – ${hour.closes}`;
}

/** Aynı saatlere sahip ardışık günleri birleştirir: "Pazartesi – Cuma: 08:30 – 18:30". */
export function summarizeOpeningHours(config: SiteConfig): Array<{ label: string; hours: string }> {
  const groups: Array<{ first: string; last: string; hours: string }> = [];

  for (const day of config.openingHours) {
    const hours = formatHours(day);
    const previous = groups.at(-1);
    if (previous && previous.hours === hours) {
      previous.last = day.label;
    } else {
      groups.push({ first: day.label, last: day.label, hours });
    }
  }

  return groups.map(({ first, last, hours }) => ({
    label: first === last ? first : `${first} – ${last}`,
    hours,
  }));
}
