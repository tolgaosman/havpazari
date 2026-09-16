/**
 * `proxy.ts` (Edge runtime) ve `lib/admin/session.ts` (Node/Server Actions)
 * arasında paylaşılan sabitler. Bilerek ayrı bir dosyada — `session.ts`
 * `next/headers` kullanıyor, bunu proxy'nin edge paketine karıştırmamak için.
 */

/** Oturum çerezinin adı. */
export const ADMIN_SESSION_COOKIE = "had_admin";

/**
 * Admin girişindeki sabit e-posta — kullanıcıdan istenmez, ekranda gösterilmez.
 * Auth (Sanctum) eklenince gerçek kimlik doğrulamayla değişecek.
 */
export const ADMIN_EMAIL = "hasankarabasak67@gmail.com";
