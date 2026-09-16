import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Konum" className={cn("overflow-x-auto", className)}>
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs text-ash-dim">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors duration-150 hover:text-brass">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-ash" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
