import type { ApiResponse } from "@/types";
import type {
  AdminBrand,
  AdminCategory,
  AdminOrder,
  AdminPaginated,
  AdminProduct,
  DashboardStats,
} from "@/types/admin";
import type { SiteConfig } from "@/lib/site";
import { adminFetchJson } from "./api";

// Okuma uçları — hepsi `no-store` (adminFetch içinde), panel her zaman
// güncel veriyi görsün diye ISR/cache devre dışı.

export function getDashboardStats(): Promise<DashboardStats> {
  return adminFetchJson<ApiResponse<DashboardStats>>("/admin/dashboard", "GET").then(
    (result) => result.data,
  );
}

export interface AdminProductQuery {
  q?: string;
  categoryId?: string;
  brandId?: string;
  page?: number;
}

function toQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getAdminProducts(query: AdminProductQuery = {}): Promise<AdminPaginated<AdminProduct>> {
  const search = toQueryString({
    ara: query.q,
    kategoriId: query.categoryId,
    markaId: query.brandId,
    sayfa: query.page,
  });
  return adminFetchJson<AdminPaginated<AdminProduct>>(`/admin/products${search}`, "GET");
}

export function getAdminProduct(id: string): Promise<AdminProduct> {
  return adminFetchJson<ApiResponse<AdminProduct>>(`/admin/products/${id}`, "GET").then(
    (result) => result.data,
  );
}

export function getAdminCategories(): Promise<AdminCategory[]> {
  return adminFetchJson<ApiResponse<AdminCategory[]>>("/admin/categories", "GET").then(
    (result) => result.data,
  );
}

export function getAdminCategory(id: string): Promise<AdminCategory> {
  return adminFetchJson<ApiResponse<AdminCategory>>(`/admin/categories/${id}`, "GET").then(
    (result) => result.data,
  );
}

export function getAdminBrands(): Promise<AdminBrand[]> {
  return adminFetchJson<ApiResponse<AdminBrand[]>>("/admin/brands", "GET").then(
    (result) => result.data,
  );
}

export interface AdminOrderQuery {
  status?: string;
  page?: number;
}

export function getAdminOrders(query: AdminOrderQuery = {}): Promise<AdminPaginated<AdminOrder>> {
  const search = toQueryString({ durum: query.status, sayfa: query.page });
  return adminFetchJson<AdminPaginated<AdminOrder>>(`/admin/orders${search}`, "GET");
}

export function getAdminOrder(id: string): Promise<AdminOrder> {
  return adminFetchJson<ApiResponse<AdminOrder>>(`/admin/orders/${id}`, "GET").then(
    (result) => result.data,
  );
}

export function getAdminSettings(): Promise<SiteConfig> {
  return adminFetchJson<ApiResponse<SiteConfig>>("/admin/settings", "GET").then(
    (result) => result.data,
  );
}
