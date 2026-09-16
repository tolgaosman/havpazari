"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Sıra içindeki gecikme (saniye) — art arda gelen bloklarda kullanılır. */
  delay?: number;
  /**
   * `true` ise scroll'u beklemeden mount olur olmaz animasyonlanır.
   *
   * Katlama üstü (above-the-fold) içerik için kullan: `whileInView` SSR
   * çıktısında elementi `opacity:0` bırakır ve yalnızca hydration bitip
   * IntersectionObserver tetiklendiğinde görünür hale gelir — yavaş bir
   * cihazda bu, zaten ekranda olması gereken içeriğin kısa süre
   * görünmemesine (flash-of-invisible-content) yol açar. Katlama altı,
   * gerçekten scroll'la ortaya çıkan bölümlerde bu prop'u kullanma.
   */
  immediate?: boolean;
}

/** Görünüme girdiğinde (ya da hemen mount'ta) aşağıdan beliren kap. */
export function Reveal({ delay = 0, immediate = false, children, ...props }: RevealProps) {
  const trigger = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: viewportOnce };

  return (
    <motion.div
      initial="hidden"
      variants={fadeUp}
      transition={{ delay }}
      {...trigger}
      {...props}
    >
      {children}
    </motion.div>
  );
}
