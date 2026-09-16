"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/admin/FormMessage";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { OrderFormState } from "@/app/admin/(dashboard)/siparisler/actions";
import { ORDER_STATUS_LABELS, type AdminOrder, type OrderStatus } from "@/types/admin";

interface OrderStatusFormProps {
  order: AdminOrder;
  action: (state: OrderFormState, formData: FormData) => Promise<OrderFormState>;
}

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][];

export function OrderStatusForm({ order, action }: OrderStatusFormProps) {
  const [state, formAction] = useActionState<OrderFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-steel bg-charcoal p-5">
      <FormMessage>{state.error}</FormMessage>
      {state.success && <FormMessage type="success">Sipariş güncellendi.</FormMessage>}

      <div>
        <Label htmlFor="status">Durum</Label>
        <Select id="status" name="status" defaultValue={order.status}>
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Not</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={order.notes ?? ""} placeholder="Kargo takip no, özel not…" />
      </div>

      <SubmitButton className="self-start">Güncelle</SubmitButton>
    </form>
  );
}
