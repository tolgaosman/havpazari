/**
 * Klavye kullanıcısı Tab'a bastığında ilk odaklanan öğe budur.
 * Görsel olarak gizli, yalnızca odaklandığında görünür — navbar'ı atlayıp
 * doğrudan içeriğe gitme imkânı verir.
 */
export function SkipLink() {
  return (
    <a
      href="#ana-icerik"
      className="fixed left-4 top-4 z-[100] -translate-y-20 rounded bg-brass px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-obsidian transition-transform duration-200 focus-visible:translate-y-0"
    >
      İçeriğe geç
    </a>
  );
}
