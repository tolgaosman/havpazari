"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Phone, Search, X } from "lucide-react";
import { FacebookGlyph } from "./SocialGlyphs";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import type { NavLink } from "@/lib/navigation";
import { snappy } from "@/lib/motion";
import { telHref, type SiteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface NavbarProps {
  categories: Category[];
  settings: SiteConfig;
}

/** Anasayfada hero'nun üstünde şeffaf başlar; kaydırınca ya da diğer
 *  sayfalarda hemen katı zemine döner. */
export function Navbar({ categories, settings }: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);

    const diff = latest - lastScrollY.current;
    if (mobileOpen || searchOpen) {
      setHidden(false);
    } else if (latest > 120 && diff > 0) {
      setHidden(true);
    } else if (diff < 0) {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  function scrollToTopIfHome(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const solid = scrolled || !isHome || mobileOpen || searchOpen;
  const navLinks: NavLink[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Mağaza", href: "/magaza" },
    ...categories.slice(0, 4).map((category) => ({
      label: category.name,
      href: `/magaza?kategori=${category.slug}`,
    })),
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" },
  ];

  // Mobil menü açıkken arka planın kaymasını engelle.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={snappy}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          solid
            ? "border-b border-steel bg-obsidian/95 backdrop-blur-sm"
            : "border-b border-transparent bg-gradient-to-b from-obsidian/70 via-obsidian/20 to-transparent",
        )}
      >
        <div className="container-page relative flex h-20 items-center justify-between gap-4">
          <Logo siteName={settings.name} onClick={scrollToTopIfHome} />

          <nav aria-label="Birincil gezinme" className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <ul className="flex items-center justify-center gap-0.5 xl:gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={link.href === "/" ? scrollToTopIfHome : undefined}
                    className="block whitespace-nowrap rounded px-2 py-2 font-display text-xs font-semibold uppercase tracking-wide text-ash transition-colors duration-200 hover:text-optic xl:px-3 xl:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute right-5 top-1/2 flex shrink-0 -translate-y-1/2 items-center gap-1.5 sm:right-8 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-full text-optic transition-colors duration-200 hover:bg-gunmetal"
              aria-label={searchOpen ? "Aramayı kapat" : "Ürün ara"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>

            <a
              href={telHref(settings.contact.phone)}
              className="hidden items-center gap-2 rounded-full border border-steel px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass sm:flex"
            >
              <Phone className="size-4" aria-hidden="true" />
              {settings.contact.phoneDisplay}
            </a>

            {settings.social.facebook && (
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook'ta takip edin"
                className="hidden size-10 items-center justify-center rounded-full border border-steel text-optic transition-colors duration-200 hover:border-brass hover:text-brass sm:flex"
              >
                <FacebookGlyph className="size-4" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-full text-optic transition-colors duration-200 hover:bg-gunmetal lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      </motion.header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        settings={settings}
        isHome={isHome}
      />
    </>
  );
}

function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = inputRef.current?.value.trim();
    onClose();
    router.push(query ? `/magaza?ara=${encodeURIComponent(query)}` : "/magaza");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={snappy}
          className="overflow-hidden border-b border-steel bg-obsidian"
        >
          <form onSubmit={handleSubmit} className="container-page flex items-center gap-3 py-4">
            <Search className="size-5 shrink-0 text-ash" aria-hidden="true" />
            <label htmlFor={inputId} className="sr-only">
              Ürün, marka veya kategori ara
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              name="ara"
              placeholder="Dürbün, tüfek, çadır, bıçak…"
              className="w-full bg-transparent font-sans text-lg text-optic placeholder:text-ash-dim focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brass px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
            >
              Ara
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
