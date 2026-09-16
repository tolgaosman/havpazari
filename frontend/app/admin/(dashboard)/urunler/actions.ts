"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminDelete, adminFetchForm, adminFetchJson } from "@/lib/admin/api";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/session";
import type { ApiResponse } from "@/types";
import type { AdminProduct } from "@/types/admin";

export interface ProductFormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

function buildProductPayload(formData: FormData) {
  const price = String(formData.get("price") ?? "").trim();
  const compareAtPrice = String(formData.get("compareAtPrice") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  return {
    categoryId: Number(formData.get("categoryId")),
    brandId: Number(formData.get("brandId")),
    name: String(formData.get("name") ?? ""),
    ...(slug ? { slug } : {}),
    sku: String(formData.get("sku") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: price ? Number(price) : null,
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
    stock: Number(formData.get("stock") ?? 0),
    isOrderOnly: formData.get("isOrderOnly") === "on",
    requiresLicense: formData.get("requiresLicense") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
    specs: JSON.parse(String(formData.get("specsJson") ?? "[]")),
    tags: formData.getAll("tags").map(String),
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  let created: AdminProduct;
  try {
    const result = await adminFetchJson<ApiResponse<AdminProduct>>(
      "/admin/products",
      "POST",
      buildProductPayload(formData),
    );
    created = result.data;
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message, fieldErrors: error.fieldErrors };
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/urunler");
  redirect(`/admin/urunler/${created.id}?olusturuldu=1`);
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  try {
    await adminFetchJson<ApiResponse<AdminProduct>>(
      `/admin/products/${id}`,
      "PUT",
      buildProductPayload(formData),
    );
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message, fieldErrors: error.fieldErrors };
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/urunler");
  revalidatePath(`/admin/urunler/${id}`);
  redirect(`/admin/urunler/${id}?guncellendi=1`);
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  await adminDelete(`/admin/products/${id}`);
  revalidateCatalog();
  revalidatePath("/admin/urunler");
  redirect("/admin/urunler");
}

export async function uploadProductImages(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const files = formData.getAll("images").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length === 0) {
    return { error: "En az bir görsel seçmelisiniz." };
  }

  const upload = new FormData();
  for (const file of files) upload.append("images[]", file);

  try {
    await adminFetchForm(`/admin/products/${productId}/images`, "POST", upload);
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message };
    throw error;
  }

  revalidateCatalog();
  revalidatePath(`/admin/urunler/${productId}`);
  return {};
}

export async function updateProductImages(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const images = JSON.parse(String(formData.get("imagesJson") ?? "[]"));

  try {
    await adminFetchJson(`/admin/products/${productId}/images`, "PATCH", { images });
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message };
    throw error;
  }

  revalidateCatalog();
  revalidatePath(`/admin/urunler/${productId}`);
  return {};
}

export async function deleteProductImage(productId: string, imageId: string): Promise<void> {
  await requireAdmin();
  await adminDelete(`/admin/product-images/${imageId}`);
  revalidateCatalog();
  revalidatePath(`/admin/urunler/${productId}`);
}
