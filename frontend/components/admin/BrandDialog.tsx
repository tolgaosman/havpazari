"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { FormMessage } from "@/components/admin/FormMessage";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BrandFormState } from "@/app/admin/(dashboard)/markalar/actions";
import type { AdminBrand } from "@/types/admin";

interface BrandDialogProps {
  action: (state: BrandFormState, formData: FormData) => Promise<BrandFormState>;
  brand?: AdminBrand;
}

/** Marka ekleme/düzenleme diyaloğu. `brand` verilmezse "yeni marka" modunda açılır. */
export function BrandDialog({ action, brand }: BrandDialogProps) {
  const [state, formAction] = useActionState<BrandFormState, FormData>(action, {});

  function error(field: string) {
    return state.fieldErrors?.[field]?.[0];
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {brand ? (
          <Button variant="outline" size="sm">
            Düzenle
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Yeni Marka
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{brand ? "Markayı Düzenle" : "Yeni Marka"}</DialogTitle>
        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <FormMessage>{state.error}</FormMessage>
          <div>
            <Label htmlFor={`brand-name-${brand?.id ?? "new"}`}>Marka Adı</Label>
            <Input id={`brand-name-${brand?.id ?? "new"}`} name="name" defaultValue={brand?.name} required />
            {error("name") && <p className="mt-1 text-xs text-stock-out">{error("name")}</p>}
          </div>
          <div>
            <Label htmlFor={`brand-country-${brand?.id ?? "new"}`}>Menşei</Label>
            <Input id={`brand-country-${brand?.id ?? "new"}`} name="country" defaultValue={brand?.country} required />
            {error("country") && <p className="mt-1 text-xs text-stock-out">{error("country")}</p>}
          </div>
          <SubmitButton className="mt-2 self-end">Kaydet</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
