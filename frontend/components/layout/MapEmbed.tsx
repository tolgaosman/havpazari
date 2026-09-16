"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface MapEmbedProps {
  src: string;
  title: string;
  className?: string;
}

/**
 * Gerçek tıkla-yükle harita gömüsü. `next.config.ts`'teki CSP yorumu ve
 * `lib/site.ts`'teki `mapEmbedSrc` bunu zaten "tıkla-yükle" olarak
 * tanımlıyordu — üçüncü taraf (Google) isteği artık kullanıcı tıklamadan
 * hiç atılmıyor.
 */
export function MapEmbed({ src, title, className }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={className}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="flex size-full min-h-[24rem] flex-col items-center justify-center gap-3 bg-charcoal text-center transition-colors duration-200 hover:bg-gunmetal lg:min-h-full"
    >
      <MapPin className="size-8 text-brass" aria-hidden="true" strokeWidth={1.5} />
      <span className="font-display text-sm font-bold uppercase tracking-wide text-optic">
        Haritayı Göster
      </span>
      <span className="max-w-xs text-xs text-ash-dim">
        Google Haritalar yalnızca tıkladığınızda yüklenir.
      </span>
    </button>
  );
}
