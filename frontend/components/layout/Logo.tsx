import Link from "next/link";
import { Crosshair } from "lucide-react";
import { defaultSiteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Aria etiketi için işletme adı. Belirtilmezse statik varsayılan kullanılır. */
  siteName?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function Logo({ className, siteName = defaultSiteConfig.name, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 font-display uppercase leading-none tracking-wider text-optic",
        className,
      )}
      aria-label={`${siteName} — anasayfa`}
    >
      <Crosshair
        className="size-6 shrink-0 text-brass transition-transform duration-300 group-hover:rotate-45"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span className="flex flex-col">
        <span className="text-lg font-bold sm:text-xl">Hasan Av</span>
        <span className="text-[0.6rem] font-medium tracking-[0.32em] text-ash">
          Dünyası
        </span>
      </span>
    </Link>
  );
}
