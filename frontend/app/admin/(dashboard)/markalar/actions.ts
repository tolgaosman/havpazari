"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminDelete, adminFetchJson } from "@/lib/admin/api";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/session";

export interface BrandFormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

function buildBrandPayload(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    country: String(formData.get("country") ?? ""),
  };
}

export async function createBrand(_prevState: BrandFormState, formData: FormData): Promise<BrandFormState> {
  await requireAdmin();

  try {
    await adminFetchJson("/admin/brands", "POST", buildBrandPayload(formData));
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message, fieldErrors: error.fieldErrors };
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/markalar");
  redirect("/admin/markalar");
}

export async function updateBrand(
  id: string,
  _prevState: BrandFormState,
  formData: FormData,
): Promise<BrandFormState> {
  await requireAdmin();

  try {
    await adminFetchJson(`/admin/brands/${id}`, "PUT", buildBrandPayload(formData));
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message, fieldErrors: error.fieldErrors };
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/markalar");
  redirect("/admin/markalar");
}

export async function deleteBrand(id: string): Promise<void> {
  await requireAdmin();

  try {
    await adminDelete(`/admin/brands/${id}`);
  } catch (error) {
    if (error instanceof AdminApiError) {
      redirect(`/admin/markalar?hata=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  revalidateCatalog();
  revalidatePath("/admin/markalar");
  redirect("/admin/markalar");
}
