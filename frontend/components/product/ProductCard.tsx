"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { discountPercent, formatPrice, stockPresentation } from "@/lib/format";
import { snappy } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  /** İlk katlandaki kartlarda tarayıcıya erken yükleme sinyali verir. */
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const cover = product.images[0];
  const stock = stockPresentation(product.stockStatus);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={snappy}
      className={cn("group relative flex flex-col", className)}
    >
      <Link
        href={`/urun/${product.slug}`}
        className="flex flex-col focus-visible:outline-none"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-steel bg-charcoal transition-colors duration-300 group-hover:border-brass group-focus-visible:border-brass">
          {cover && (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
              // Next.js 16'da `priority` deprecated — `preload` + `loading="eager"`
              // ikilisi aynı işi görür (bkz. next/image referansı).
              preload={priority}
              loading={priority ? "eager" : undefined}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          )}

          <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3">
            <div className="flex flex-wrap gap-1.5">
              {product.isNew && <Badge variant="brass">Yeni</Badge>}
              {discount !== null && <Badge variant="blaze">%{discount} indirim</Badge>}
              {product.stockStatus === "low_stock" && (
                <Badge variant="outline">Son adet</Badge>
              )}
            </div>
          </div>

          {product.requiresLicense && (
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-obsidian/85 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-ash backdrop-blur-sm">
              <ShieldAlert className="size-3.5 shrink-0 text-brass" aria-hidden="true" />
              Ruhsatlı satış
            </div>
          )}

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-brass py-2.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-obsidian transition-transform duration-300 ease-out group-hover:translate-y-0"
          >
            İncele
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-1">
          <span lang="en" className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ash-dim">
            {product.brand.name}
          </span>
          <h3 lang="en" className="font-display text-base font-semibold uppercase leading-tight tracking-wide text-optic">
            {product.name}
          </h3>

          {/* Dar kartlarda (mobilde 2 sütunlu ızgara) fiyat + stok etiketi
              yan yana sığmayabiliyor — bu yüzden mobilde alt alta, geniş
              kartlarda (sm+) yan yana. */}
          <div className="mt-1 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <PriceDisplay product={product} />
            <span className="flex min-w-0 items-center gap-1.5 text-[0.65rem] text-ash-dim">
              <span
                className={cn("size-1.5 shrink-0 rounded-full", stock.dotClassName)}
                aria-hidden="true"
              />
              <span className={cn(stock.textClassName, "truncate")}>{stock.label}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PriceDisplay({ product }: { product: Product }) {
  if (product.price === null) {
    return (
      <span className="font-display text-sm font-bold uppercase tracking-wide text-brass">
        Fiyat için arayın
      </span>
    );
  }

  return (
    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="font-display text-lg font-bold text-optic">
        {formatPrice(product.price)}
      </span>
      {product.compareAtPrice !== null && (
        <span className="text-xs text-ash-dim line-through">
          {formatPrice(product.compareAtPrice)}
        </span>
      )}
    </span>
  );
}
