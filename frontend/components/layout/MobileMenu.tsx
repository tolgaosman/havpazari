"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Phone, X } from "lucide-react";
import type { NavLink } from "@/lib/navigation";
import { soft } from "@/lib/motion";
import { telHref, whatsappHref, type SiteConfig } from "@/lib/site";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  settings: SiteConfig;
  isHome: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ open, onClose, navLinks, settings, isHome }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Basit odak tuzağı: panel açıldığında kapat düğmesine odaklan,
  // Tab döngüsü panelin dışına çıkmasın, Esc menüyü kapatsın.
  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-obsidian/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menüsü"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={soft}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-steel bg-charcoal lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-steel px-5 py-5">
              <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ash">
                Menü
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-full text-optic transition-colors duration-200 hover:bg-gunmetal"
                aria-label="Menüyü kapat"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav aria-label="Mobil gezinme" className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(event) => {
                        onClose();
                        if (link.href === "/" && isHome) {
                          event.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="block border-b border-steel py-4 font-display text-xl font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:text-brass"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-3 border-t border-steel px-5 py-6">
              <a
                href={telHref(settings.contact.phone)}
                className="flex items-center justify-center gap-2 rounded-full border border-steel py-3 font-display text-sm font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
              >
                <Phone className="size-4" aria-hidden="true" />
                {settings.contact.phoneDisplay}
              </a>
              <a
                href={whatsappHref(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-brass py-3 font-display text-sm font-bold uppercase tracking-wide text-obsidian transition-colors duration-200 hover:bg-brass-bright"
              >
                WhatsApp&apos;tan Yaz
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
