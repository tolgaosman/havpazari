"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { FormMessage } from "@/components/admin/FormMessage";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryFormState } from "@/app/admin/(dashboard)/kategoriler/actions";
import type { AdminCategory } from "@/types/admin";

interface CategoryFormProps {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  defaultValues?: AdminCategory;
  submitLabel: string;
}

export function CategoryForm({ action, defaultValues, submitLabel }: CategoryFormProps) {
  const [state, formAction] = useActionState<CategoryFormState, FormData>(action, {});
  const [preview, setPreview] = useState<string | null>(defaultValues?.imageUrl ?? null);

  function error(field: string) {
    return state.fieldErrors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <FormMessage>{state.error}</FormMessage>

      <div>
        <Label htmlFor="name">Kategori Adı</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        {error("name") && <p className="mt-1 text-xs text-stock-out">{error("name")}</p>}
      </div>

      <div>
        <Label htmlFor="slug">Bağlantı (slug)</Label>
        <Input id="slug" name="slug" defaultValue={defaultValues?.slug} required={Boolean(defaultValues)} />
        {error("slug") && <p className="mt-1 text-xs text-stock-out">{error("slug")}</p>}
      </div>

      <div>
        <Label htmlFor="tagline">Tanıtım Metni</Label>
        <Input id="tagline" name="tagline" defaultValue={defaultValues?.tagline} required />
        {error("tagline") && <p className="mt-1 text-xs text-stock-out">{error("tagline")}</p>}
      </div>

      <div>
        <Label htmlFor="description">Açıklama</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={defaultValues?.description} required />
        {error("description") && <p className="mt-1 text-xs text-stock-out">{error("description")}</p>}
      </div>

      <div>
        <Label htmlFor="sortOrder">Sıra</Label>
        <Input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue={defaultValues?.sortOrder ?? 0} className="max-w-32" />
      </div>

      <div>
        <Label htmlFor="image">Görsel</Label>
        {preview && (
          <div className="relative mb-3 aspect-video w-full max-w-sm overflow-hidden rounded-md border border-steel bg-gunmetal">
            <Image src={preview} alt="" fill sizes="400px" className="object-cover" />
          </div>
        )}
        <input
          id="image"
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="text-sm text-ash file:mr-4 file:rounded-full file:border-0 file:bg-steel file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-optic hover:file:bg-steel-bright"
        />
        {error("image") && <p className="mt-1 text-xs text-stock-out">{error("image")}</p>}
      </div>

      <div>
        <Label htmlFor="imageAlt">Görsel Alternatif Metni</Label>
        <Input id="imageAlt" name="imageAlt" defaultValue={defaultValues?.imageAlt} required />
        {error("imageAlt") && <p className="mt-1 text-xs text-stock-out">{error("imageAlt")}</p>}
      </div>

      <div>
        <SubmitButton size="lg">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
