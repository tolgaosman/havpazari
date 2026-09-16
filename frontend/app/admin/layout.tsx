import type { Metadata } from "next";

// Panel her zaman canlı veri okur (oturum çerezine, backend'e bağlı) —
// build sırasında statik olarak üretilmeye çalışılınca backend yoksa/kapalıyken
// hata verir. Tüm `/admin/*` alt ağacını dinamik render'a zorluyoruz.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s — Panel" },
  robots: { index: false, follow: false },
};

/** `/admin/*` için ortak metadata. Kenar çubuklu kabuk `(dashboard)/layout.tsx`'te
 *  — `/admin/giris` bu kabuğu istemiyor, aynı seviyede kalması için ayrıldı. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
