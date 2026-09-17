import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/constants";

/**
 * `/admin/*` erişim koruması — hızlı, kaba bir ön kontrol.
 *
 * Edge runtime'da çalıştığı için backend'e istek atıp token'ı doğrulayamaz;
 * yalnızca çerezin varlığına bakar. Asıl doğrulama `lib/admin/api.ts` içinde
 * gerçekleşir: her admin isteğinde token backend'e `Authorization: Bearer`
 * olarak gönderilir, 401 dönerse çerez silinip girişe yönlendirilir. Yani bu
 * dosya UX için erken bir kısayol, güvenlik sınırı backend'dedir.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/giris") {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(ADMIN_SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/admin/giris", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
