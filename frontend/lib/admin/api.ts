import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "./constants";

/**
 * Admin panelin backend istemcisi — yalnızca Server Actions/Server
 * Components içinde çalışır (`server-only` bunu derleme zamanında zorunlu
 * kılar). Herkese açık `lib/api.ts`'ten ayrı tutuluyor çünkü mock veriye
 * düşmüyor: backend yoksa panel "Backend bağlı değil" der, sessizce mock
 * göstermez — Hasan Bey'in yaptığı değişiklik hiçbir yere kaydolmaz.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** Laravel 422 doğrulama hataları: `{ alanAdi: ["mesaj"] }`. */
    readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

/** Backend'e bağlı değilken kasıtlı olarak fırlatılır — panel bunu yakalayıp uyarı gösterir. */
export class AdminApiNotConfiguredError extends Error {
  constructor() {
    super("NEXT_PUBLIC_API_URL tanımlı değil — admin panel backend'e bağlı değil.");
    this.name = "AdminApiNotConfiguredError";
  }
}

interface AdminFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** JSON gövde. `body`/`formData` ile birlikte kullanılmaz. */
  json?: unknown;
  /** multipart/form-data gövde (dosya yükleme). */
  formData?: FormData;
}

async function adminFetch<T>(path: string, options: AdminFetchOptions = {}): Promise<T> {
  if (!API_URL) throw new AdminApiNotConfiguredError();

  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    redirect("/admin/giris");
  }

  const method = options.method ?? "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.json);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  if (response.status === 401) {
    // Token geçersiz/süresi dolmuş — yerel çerezi temizle ve girişe dön.
    jar.delete(ADMIN_SESSION_COOKIE);
    redirect("/admin/giris");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 422) {
      throw new AdminApiError(
        payload?.message ?? "Doğrulama hatası.",
        422,
        payload?.errors,
      );
    }
    throw new AdminApiError(
      payload?.message ?? `İstek başarısız (${response.status}).`,
      response.status,
    );
  }

  return payload as T;
}

/** JSON gövdeli istek. */
export function adminFetchJson<T>(
  path: string,
  method: AdminFetchOptions["method"],
  json?: unknown,
): Promise<T> {
  return adminFetch<T>(path, { method, json });
}

/**
 * Dosya içerebilen istek. PHP, `multipart/form-data` gövdeyi yalnızca POST
 * ile ayrıştırır — PUT/PATCH güncellemede Laravel'in `_method` alanıyla
 * "method spoofing" kullanılır (bkz. Laravel form method spoofing).
 */
export function adminFetchForm<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH",
  formData: FormData,
): Promise<T> {
  if (method !== "POST") {
    formData.set("_method", method);
  }
  return adminFetch<T>(path, { method: "POST", formData });
}

export function adminDelete(path: string): Promise<void> {
  return adminFetch<void>(path, { method: "DELETE" });
}

/** 422 hatasından tek alan mesajını okumak için küçük yardımcı. */
export function fieldError(error: unknown, field: string): string | undefined {
  if (error instanceof AdminApiError) {
    return error.fieldErrors?.[field]?.[0];
  }
  return undefined;
}
