import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shopHref, withQueryChange } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import type { PaginationMeta, ProductQuery } from "@/types";

interface PaginationProps {
  query: ProductQuery;
  meta: PaginationMeta;
}

export function Pagination({ query, meta }: PaginationProps) {
  if (meta.lastPage <= 1) return null;

  const pages = pageWindow(meta.currentPage, meta.lastPage);

  return (
    <nav aria-label="Sayfalar" className="flex items-center justify-center gap-1.5 pt-4">
      <PageLink
        query={query}
        page={meta.currentPage - 1}
        disabled={meta.currentPage <= 1}
        aria-label="Önceki sayfa"
      >
        <ChevronLeft className="size-4" />
      </PageLink>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-ash-dim">
            …
          </span>
        ) : (
          <PageLink key={page} query={query} page={page} current={page === meta.currentPage}>
            {page}
          </PageLink>
        ),
      )}

      <PageLink
        query={query}
        page={meta.currentPage + 1}
        disabled={meta.currentPage >= meta.lastPage}
        aria-label="Sonraki sayfa"
      >
        <ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

interface PageLinkProps {
  query: ProductQuery;
  page: number;
  current?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}

function PageLink({ query, page, current, disabled, children, ...rest }: PageLinkProps) {
  const className = cn(
    "flex size-9 items-center justify-center rounded-full font-display text-sm font-semibold transition-colors duration-150",
    current
      ? "bg-brass text-obsidian"
      : disabled
        ? "cursor-not-allowed text-ash-dim/50"
        : "text-ash hover:bg-gunmetal hover:text-optic",
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled="true" {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={shopHref(withQueryChange(query, { page }))}
      aria-current={current ? "page" : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Sayfa numaralarını "1 … 4 5 6 … 12" biçiminde daraltır. */
function pageWindow(current: number, last: number): Array<number | "ellipsis"> {
  const delta = 1;
  const range: Array<number | "ellipsis"> = [];
  let previous: number | undefined;

  for (let page = 1; page <= last; page++) {
    const withinDelta = Math.abs(page - current) <= delta;
    if (page === 1 || page === last || withinDelta) {
      if (previous !== undefined && page - previous > 1) range.push("ellipsis");
      range.push(page);
      previous = page;
    }
  }

  return range;
}
