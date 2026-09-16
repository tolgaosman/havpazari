"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { snappy } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-steel bg-charcoal">
        {/* initial={false}: ilk yüklemede ana görsel hemen (fade'siz) boyanır —
            aksi halde opacity animasyonu LCP boyanmasını geciktirir ve Next.js
            bu görseli değil, animasyonsuz bir küçük resmi LCP adayı sanabilir. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={snappy}
            className="absolute inset-0"
          >
            <Image
              src={active.url}
              alt={active.alt}
              fill
              preload
              loading="eager"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3" role="tablist" aria-label={`${productName} görselleri`}>
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}. görseli göster`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-md border transition-colors duration-200",
                index === activeIndex
                  ? "border-brass"
                  : "border-steel opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
