import Link from "next/link";
import { SearchX } from "lucide-react";
import { telHref, type SiteConfig } from "@/lib/site";

interface EmptyStateProps {
  hasFilters: boolean;
  settings: SiteConfig;
}

export function EmptyState({ hasFilters, settings }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-steel py-20 text-center">
      <SearchX className="size-10 text-ash-dim" aria-hidden="true" />
      <div>
        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-optic">
          {hasFilters ? "Ürün Bulunamadı" : "Henüz Ürün Eklenmedi"}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-ash">
          {hasFilters
            ? "Bu filtrelerle eşleşen ürün yok. Filtreleri değiştirmeyi deneyin ya da bizi arayın, elimizde olup olmadığını hemen söyleyelim."
            : "Katalog yakında güncellenecek. Aradığınız ürün için mağazayı arayın."}
        </p>
      </div>
      {hasFilters ? (
        <Link
          href="/magaza"
          className="mt-2 rounded-full border border-steel px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
        >
          Filtreleri Temizle
        </Link>
      ) : (
        <a
          href={telHref(settings.contact.phone)}
          className="mt-2 rounded-full border border-steel px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-optic transition-colors duration-200 hover:border-brass hover:text-brass"
        >
          {settings.contact.phoneDisplay}
        </a>
      )}
    </div>
  );
}
