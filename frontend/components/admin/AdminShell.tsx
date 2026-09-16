"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  Trophy,
  X,
} from "lucide-react";
import { logout } from "@/lib/admin/session";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Tags },
  { href: "/admin/markalar", label: "Markalar", icon: Trophy },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBag },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <div className="min-h-dvh bg-obsidian text-optic lg:flex">
      {/* Masaüstü kenar çubuğu */}
      <aside className="hidden w-60 shrink-0 border-r border-steel bg-charcoal lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} isActive={isActive} onNavigate={() => {}} />
      </aside>

      {/* Mobil üst bar + açılır menü */}
      <div className="border-b border-steel bg-charcoal px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-optic">
            Hasan Av — Panel
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
            className="flex size-10 items-center justify-center rounded-full text-optic hover:bg-gunmetal"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-steel bg-charcoal">
            <div className="flex items-center justify-between border-b border-steel px-5 py-5">
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ash">
                Menü
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Menüyü kapat"
                className="flex size-9 items-center justify-center rounded-full text-optic hover:bg-gunmetal"
              >
                <X className="size-4" />
              </button>
            </div>
            <SidebarContent pathname={pathname} isActive={isActive} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({
  isActive,
  onNavigate,
}: {
  pathname: string;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="hidden border-b border-steel px-6 py-6 lg:block">
        <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-optic">
          Hasan Av
        </span>
        <p className="mt-0.5 text-xs text-ash-dim">Yönetim Paneli</p>
      </div>

      <nav aria-label="Panel gezinme" className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  isActive(item.href)
                    ? "bg-brass text-obsidian"
                    : "text-ash hover:bg-gunmetal hover:text-optic",
                )}
              >
                <item.icon className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-steel p-3">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ash transition-colors duration-200 hover:bg-gunmetal hover:text-stock-out"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  );
}
