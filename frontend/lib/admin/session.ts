"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "./constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const SESSION_MAX_AGE = 60 * 60 * 24; // 1 gün

export interface LoginState {
  error?: string;
}

/**
 * Backend'e e-posta/şifre gönderir, dönen Sanctum token'ını httpOnly çerezde
 * saklar. `useActionState` imzasına uyar: `(önceki durum, form verisi)`.
 */
export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (email === "" || password === "") {
    return { error: "E-posta ve şifre zorunlu." };
  }

  if (!API_URL) {
    return { error: "Backend bağlı değil — NEXT_PUBLIC_API_URL tanımlı değil." };
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { error: "Backend'e ulaşılamadı. Sunucunun çalıştığından emin olun." };
  }

  if (response.status === 429) {
    return { error: "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar deneyin." };
  }

  if (!response.ok) {
    return { error: "E-posta veya şifre hatalı." };
  }

  const payload = await response.json().catch(() => null);
  const token: string | undefined = payload?.data?.token;
  if (!token) {
    return { error: "Sunucudan beklenmeyen bir yanıt geldi." };
  }

  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}

/** Backend'deki token'ı iptal eder, ardından yerel çerezi siler. */
export async function logout(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;

  if (token && API_URL) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
    } catch {
      // Backend'e ulaşılamasa bile yerel oturum sonlandırılmalı.
    }
  }

  jar.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/giris");
}

/**
 * Her admin server action'ının başında çağrılır. Çerez yoksa girişe
 * yönlendirir — `proxy.ts` sayfa yüklemelerini zaten koruyor (yalnızca
 * varlık kontrolü); asıl doğrulama backend'in 401 yanıtıyla
 * `lib/admin/api.ts` içinde yapılır ve orada da girişe yönlendirilir.
 */
export async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  if (!jar.has(ADMIN_SESSION_COOKIE)) {
    redirect("/admin/giris");
  }
}
