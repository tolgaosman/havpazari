"use server";

import { revalidatePath } from "next/cache";
import { AdminApiError, adminFetchJson } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";

export interface OrderFormState {
  error?: string;
  success?: boolean;
}

export async function updateOrder(
  id: string,
  _prevState: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  await requireAdmin();

  try {
    await adminFetchJson(`/admin/orders/${id}`, "PATCH", {
      status: String(formData.get("status") ?? ""),
      notes: String(formData.get("notes") ?? "") || null,
    });
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/siparisler");
  revalidatePath(`/admin/siparisler/${id}`);
  revalidatePath("/admin");
  return { success: true };
}
