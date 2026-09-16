import type { ProductSpec } from "@/types";

/** "Teknik föy" — mono font ve seyrek harf aralığıyla spec-sheet hissi. */
export function SpecSheet({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;

  return (
    <div className="border border-steel">
      <h2 className="border-b border-steel bg-gunmetal px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-optic">
        Teknik Özellikler
      </h2>
      <dl>
        {specs.map((spec, index) => (
          <div
            key={spec.label}
            className={`flex items-baseline justify-between gap-4 px-4 py-2.5 ${
              index % 2 === 1 ? "bg-charcoal/60" : ""
            }`}
          >
            <dt className="font-mono text-xs uppercase tracking-[0.1em] text-ash-dim">
              {spec.label}
            </dt>
            <dd className="text-right font-mono text-sm text-optic">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
