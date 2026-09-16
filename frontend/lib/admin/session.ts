"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "./constants";

/**
 * Oturum iskeleti — gerçek kimlik doğrulama yok.
 *
 * TODO: Laravel Sanctum eklenince bu dosya değişecek tek yer olmalı:
 * `login()` backend'e e-posta/şifre gönderip dönen token'ı çerezde
 * saklayacak, `requireAdmin()` token'ı doğrulayacak. Şimdilik "her şifre
 * kabul edilir" — panel arayüzünü ve backend uçlarını önceden kurmak için.
 */

export interface LoginState {
  error?: string;
}

/**
 * Şifre alanı boş olmadığı sürece girişe izin verir.
 * `useActionState` imzasına uyar: `(önceki durum, form verisi)`.
 */
export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (password.trim() === "") {
    return { error: "Şifre alanı boş olamaz." };
  }

  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/giris");
}

/**
 * Her admin server action'ının başında çağrılır. Oturum yoksa girişe
 * yönlendirir — `proxy.ts` sayfa yüklemelerini zaten koruyor, bu ikinci bir
 * kat (bir action doğrudan çağrılırsa da korunsun diye).
 */
export async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  if (!jar.has(ADMIN_SESSION_COOKIE)) {
    redirect("/admin/giris");
  }
}
