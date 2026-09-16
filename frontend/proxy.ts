import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/constants";

/**
 * `/admin/*` erişim koruması. Auth henüz yok (bkz. `lib/admin/session.ts`
 * TODO'su) — burada yalnızca oturum çerezinin varlığına bakılır. Sanctum
 * eklendiğinde bu dosyaya dokunmaya gerek kalmaz, yalnızca çerez adı/kontrolü
 * bir token doğrulamasına dönüşür.
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
