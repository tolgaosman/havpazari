"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface StaggerProps extends HTMLMotionProps<"div"> {
  /** Çocuklar arası gecikme (saniye). */
  stagger?: number;
  /**
   * `true` ise scroll'u beklemeden mount olur olmaz animasyonlanır.
   * Bkz. `Reveal`'daki aynı isimli prop'un gerekçesi — katlama üstü,
   * sayfanın asıl içeriği olan ızgaralarda (ör. /magaza ürün listesi) kullan.
   */
  immediate?: boolean;
}

/**
 * Çocuklarını sırayla açan kap. Her doğrudan çocuk kendi `fadeUp`
 * varyantını miras alır — ek bir sarmalayıcıya gerek kalmaz, `motion.li`
 * veya `motion.div` olarak doğrudan render edilebilirler (bkz. StaggerItem).
 */
export function Stagger({ stagger = 0.06, immediate = false, children, ...props }: StaggerProps) {
  const trigger = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: viewportOnce };

  return (
    <motion.div
      initial="hidden"
      variants={staggerContainer(stagger)}
      {...trigger}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** `Stagger` içindeki her öğeyi sarmalayan birim. */
export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUp} {...props}>
      {children}
    </motion.div>
  );
}
