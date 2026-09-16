import type { Brand } from "@/types";

interface BrandMarqueeProps {
  brands: Brand[];
}

/**
 * Sonsuz kayan marka şeridi.
 *
 * Saf CSS animasyonu (bkz. globals.css `--animate-marquee`) — JS'e gerek yok.
 * `prefers-reduced-motion: reduce` global kuralla otomatik durur.
 * Liste iki kez yazılıp %50 kaydırılarak dikişsiz döngü elde edilir.
 */
export function BrandMarquee({ brands }: BrandMarqueeProps) {
  if (brands.length === 0) return null;

  return (
    <section
      aria-label="Mağazamızda bulunan markalar"
      className="overflow-hidden border-t border-steel bg-obsidian py-10"
    >
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-12 pr-12"
          >
            {brands.map((brand) => (
              <li
                key={brand.id}
                lang="en"
                className="whitespace-nowrap font-display text-2xl font-bold uppercase tracking-wide text-ash-dim transition-colors duration-300 hover:text-optic sm:text-3xl"
              >
                {brand.name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
