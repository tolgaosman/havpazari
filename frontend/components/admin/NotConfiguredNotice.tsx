import { TriangleAlert } from "lucide-react";

/** `NEXT_PUBLIC_API_URL` tanımlı değilken her admin sayfasında gösterilir. */
export function NotConfiguredNotice() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-steel py-16 text-center">
      <TriangleAlert className="size-8 text-stock-low" aria-hidden="true" />
      <div>
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-optic">
          Backend Bağlı Değil
        </h2>
        <p className="mt-1 max-w-sm text-sm text-ash">
          Panelin çalışması için <code className="text-brass">.env.local</code> içinde{" "}
          <code className="text-brass">NEXT_PUBLIC_API_URL</code> tanımlanmalı ve Laravel
          sunucusu çalışıyor olmalı.
        </p>
      </div>
    </div>
  );
}
