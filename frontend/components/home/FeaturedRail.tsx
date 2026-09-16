"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface FeaturedRailProps {
  products: Product[];
}

/** Yatay kaydırmalı ürün rayı. Kütüphane yok: native scroll-snap + drag. */
export function FeaturedRail({ products }: FeaturedRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft >= maxScroll - 8);
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-rail-item]");
    const distance = (card?.offsetWidth ?? 320) + 16;
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section className="border-t border-steel bg-charcoal py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3">
            <span className="rule-brass w-16" aria-hidden="true" />
            <h2 className="text-display-md font-bold uppercase text-optic">
              Öne Çıkan Ekipman
            </h2>
            <p className="max-w-xl text-ash">
              Mağazada en çok tercih edilen ve yeni gelen ürünler.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/magaza"
              className="flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wide text-brass transition-colors duration-200 hover:text-brass-bright"
            >
              Tümünü Gör
              <ArrowUpRight className="size-4" />
            </Link>
            <div className="ml-2 hidden items-center gap-2 sm:flex">
              <RailButton direction="left" disabled={atStart} onClick={() => scrollByCard(-1)} />
              <RailButton direction="right" disabled={atEnd} onClick={() => scrollByCard(1)} />
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="hide-scrollbar container-page flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            data-rail-item
            className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[23vw]"
          >
            <ProductCard product={product} priority={index < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RailButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Önceki ürünler" : "Sonraki ürünler"}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-steel text-optic transition-colors duration-200",
        disabled ? "opacity-30" : "hover:border-brass hover:text-brass",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
