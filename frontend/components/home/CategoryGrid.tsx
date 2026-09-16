import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="border-t border-steel bg-obsidian py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mb-12 flex flex-col gap-3 sm:mb-16">
          <span className="rule-brass w-16" aria-hidden="true" />
          <h2 className="text-display-md font-bold uppercase text-optic">
            Kategoriler
          </h2>
          <p className="max-w-xl text-ash">
            İhtiyacınız ne olursa olsun — silahtan çadıra, bıçaktan çizmeye —
            beş bölümde toparladık.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2">
          {categories.map((category, index) => (
            <StaggerItem
              key={category.slug}
              className={cn(
                "group relative overflow-hidden rounded-lg border border-steel bg-charcoal",
                // İlk kategori diğerlerinden büyük — asimetrik, "yapısal" ızgara.
                index === 0
                  ? "sm:col-span-2 lg:col-span-4 lg:row-span-2"
                  : "lg:col-span-2",
              )}
            >
              <Link
                href={`/magaza?kategori=${category.slug}`}
                className="relative flex h-full min-h-[16rem] flex-col justify-end p-6 sm:min-h-[20rem]"
              >
                <Image
                  src={category.imageUrl}
                  alt={category.imageAlt}
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 60vw, 100vw"
                      : "(min-width: 1024px) 30vw, 100vw"
                  }
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent transition-colors duration-300 group-hover:from-obsidian/95" />

                <div className="relative flex items-end justify-between gap-4">
                  <div>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brass">
                      {category.tagline}
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-none tracking-wide text-optic sm:text-3xl">
                      {category.name}
                    </h3>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-steel text-optic transition-colors duration-200 group-hover:border-brass group-hover:bg-brass group-hover:text-obsidian">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
