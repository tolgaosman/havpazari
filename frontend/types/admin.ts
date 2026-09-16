/**
 * Admin panel veri şekilleri — backend `App\Http\Resources\Api\V1\Admin\*`
 * ile birebir eşleşir (camelCase). `types/index.ts`'teki public `Product`
 * şeklinden farklı: fiyat gizlenmez, `stock`/`categoryId`/`brandId` gibi
 * düzenlenebilir ham alanlar döner.
 */

import type { ProductSpec, StockStatus } from "@/types";

export interface AdminProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number | null;
  compareAtPrice: number | null;
  stock: number;
  isOrderOnly: boolean;
  requiresLicense: boolean;
  isFeatured: boolean;
  isNew: boolean;
  specs: ProductSpec[];
  tags: string[];
  stockStatus: StockStatus;
  categoryId: string;
  categoryName?: string;
  brandId: string;
  brandName?: string;
  images: AdminProductImage[];
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  sortOrder: number;
  productCount?: number;
}

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  country: string;
  productCount?: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Beklemede",
  processing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export interface AdminOrderItem {
  id: string;
  productId: string | null;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  line1: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  notes: string | null;
  customerName?: string;
  items?: AdminOrderItem[];
  createdAt: string;
}

export interface AdminPaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface AdminPaginated<T> {
  data: T[];
  meta: AdminPaginationMeta;
}

export interface DashboardStats {
  productCount: number;
  outOfStockCount: number;
  lowStockCount: number;
  pendingOrderCount: number;
  lowStockProducts: AdminProduct[];
  recentOrders: AdminOrder[];
}
