/**
 * `proxy.ts` (Edge runtime) ve `lib/admin/session.ts` (Node/Server Actions)
 * arasında paylaşılan sabitler. Bilerek ayrı bir dosyada — `session.ts`
 * `next/headers` kullanıyor, bunu proxy'nin edge paketine karıştırmamak için.
 */

/** Oturum çerezinin adı. Değeri artık backend'den alınan Sanctum token'ıdır. */
export const ADMIN_SESSION_COOKIE = "had_admin";

/** Giriş formunda e-posta alanının varsayılan değeri (yalnızca kolaylık; girilebilir). */
export const ADMIN_EMAIL = "hasankarabasak67@gmail.com";
