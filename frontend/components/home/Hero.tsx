"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDown, MapPin } from "lucide-react";
import { editorialImages } from "@/lib/mockData";
import { glide, staggerContainer } from "@/lib/motion";
import type { SiteConfig } from "@/lib/site";

const headline = ["AV SEZONUNA", "HAZIRLIKLI", "ÇIKIN"];

export function Hero({ settings }: { settings: SiteConfig }) {
  return (
    <section className="relative flex min-h-[88vh] items-start overflow-hidden bg-obsidian sm:min-h-[92vh] sm:items-end">
      <Image
        src={editorialImages.hero.url}
        alt={editorialImages.hero.alt}
        fill
        preload
        loading="eager"
        sizes="100vw"
        // Görsel dikey çekilmiş. Geniş masaüstü kadrajında yalnızca dar bir
        // yatay şerit görünür — orada avcı ve gökyüzü birlikte kalsın diye
        // odağı hafif yukarı kaydırıyoruz. Dar mobil kadrajda görselin
        // tamamı görünür (bu değer orada etkisiz kalır); metin bu yüzden
        // mobilde üstteki boş gökyüzü alanına, masaüstünde ise avcının
        // solundaki boşluğa yerleştirilir (bkz. aşağıdaki `items-start
        // sm:items-end`).
        style={{ objectPosition: "center 50%" }}
        className="object-cover"
      />
      {/* Mobilde metin üstte olduğundan üstten karartma; masaüstünde soldaki metin için soldan karartma; alttan yumuşak geçiş */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/75 via-obsidian/20 to-transparent sm:hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent via-20%" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/25 to-transparent" />
      <div className="grain-overlay" aria-hidden="true" />

      <div className="container-page relative flex w-full flex-col gap-5 pb-10 pt-28 sm:gap-8 sm:pb-28 sm:pt-40">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1, 0.2)}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-brass"
        >
          <MapPin className="size-3.5" aria-hidden="true" />
          <span>{settings.address.region} — KKTC</span>
        </motion.div>

        <h1 className="max-w-4xl overflow-hidden">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.12, 0.3)}
            className="block"
          >
            {headline.map((line) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  variants={{
                    hidden: { y: "110%" },
                    visible: { y: 0, transition: glide },
                  }}
                  className="block text-display-lg font-bold uppercase text-optic sm:text-display-xl"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...glide, delay: 0.75 }}
          className="max-w-lg text-base text-ash sm:text-lg"
        >
          Tüfekten dürbüne, kamuflajdan kamp çadırına — Düzova&apos;da elden
          görüp denediğiniz gerçek ekipman.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...glide, delay: 0.9 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <Link
            href="/magaza"
            className="inline-flex h-14 items-center justify-center rounded-full bg-brass px-8 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
          >
            Ekipmanları İncele
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex h-14 items-center justify-center rounded-full border border-steel px-8 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
          >
            Mağazaya Gel
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ash sm:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em]">Keşfet</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
