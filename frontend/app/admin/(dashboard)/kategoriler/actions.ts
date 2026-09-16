"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminDelete, adminFetchForm } from "@/lib/admin/api";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/session";

export interface CategoryFormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();

  try {
    await adminFetchForm("/admin/categories", "POST", formData);
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message, fieldErrors: error.fieldErrors };
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/kategoriler");
  redirect("/admin/kategoriler");
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();

  try {
    await adminFetchForm(`/admin/categories/${id}`, "PUT", formData);
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message, fieldErrors: error.fieldErrors };
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/kategoriler");
  redirect("/admin/kategoriler");
}

/** 409 (ürünü olan kategori) durumunda listeye hata mesajıyla döner. */
export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();

  try {
    await adminDelete(`/admin/categories/${id}`);
  } catch (error) {
    if (error instanceof AdminApiError) {
      redirect(`/admin/kategoriler?hata=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/kategoriler");
  redirect("/admin/kategoriler");
}
