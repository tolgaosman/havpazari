import { ShieldAlert } from "lucide-react";

/** Ateşli silah / mühimmat gibi ruhsata tabi ürünlerde gösterilen uyarı bloğu. */
export function LicenseNotice() {
  return (
    <div className="flex gap-3 rounded-lg border border-brass/40 bg-brass/10 p-4">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-brass" aria-hidden="true" />
      <div className="text-sm text-optic">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-brass">
          Ruhsatlı Satış
        </p>
        <p className="mt-1 text-ash">
          Bu ürünün satışı yalnızca mağazamızda, geçerli kimlik ve av
          tezkeresi/ruhsat belgesi ile yapılır. Fiyat bilgisi ve stok durumu
          için lütfen bizi arayın.
        </p>
      </div>
    </div>
  );
}
