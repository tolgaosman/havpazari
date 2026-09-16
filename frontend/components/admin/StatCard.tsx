import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  href?: string;
  tone?: "default" | "warning" | "danger";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-optic",
  warning: "text-stock-low",
  danger: "text-stock-out",
};

export function StatCard({ label, value, href, tone = "default" }: StatCardProps) {
  const content = (
    <>
      <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ash">{label}</p>
      <p className={cn("mt-2 font-display text-3xl font-bold", TONE_CLASSES[tone])}>{value}</p>
    </>
  );

  const className = "block rounded-lg border border-steel bg-charcoal p-5 transition-colors duration-200 hover:border-brass";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
