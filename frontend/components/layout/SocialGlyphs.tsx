/**
 * lucide-react bu sürümde marka/logo ikonlarını içermiyor (ticari marka
 * ihtilafları nedeniyle üst akışta kaldırıldı). Yalnızca ihtiyacımız olan
 * minimal glif için bağımsız, lisanssız outline SVG.
 */

type GlyphProps = { className?: string; "aria-hidden"?: boolean };

export function FacebookGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.12 3H14c-2.28 0-3.77 1.38-3.77 3.89v2.32H8v3.1h2.23V21h3.2v-8.69h2.4l.37-3.1h-2.77V7.24c0-.79.39-1.56 1.63-1.56h1.26V3.2A17.3 17.3 0 0 0 16.12 3Z" />
    </svg>
  );
}

export function WhatsAppGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.32 4.94L2 22l5.2-1.36a9.95 9.95 0 0 0 4.84 1.24h.01c5.52 0 10-4.48 10-10s-4.49-9.88-10.01-9.88Zm0 18.02h-.01a8.4 8.4 0 0 1-4.28-1.17l-.31-.18-3.09.81.82-3-.2-.31a8.3 8.3 0 0 1-1.28-4.43c0-4.6 3.75-8.34 8.36-8.34 2.23 0 4.33.87 5.91 2.45a8.28 8.28 0 0 1 2.44 5.9c0 4.6-3.75 8.27-8.36 8.27Zm4.58-6.19c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.11-.23-.17-.48-.3Z" />
    </svg>
  );
}
