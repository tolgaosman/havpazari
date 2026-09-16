"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormMessage } from "@/components/admin/FormMessage";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import type { AdminProductImage } from "@/types/admin";
import type { ProductFormState } from "@/app/admin/(dashboard)/urunler/actions";

interface ProductImageManagerProps {
  productId: string;
  images: AdminProductImage[];
  uploadAction: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  updateAction: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  deleteAction: (imageId: string) => Promise<void>;
}

export function ProductImageManager({ images, uploadAction, updateAction, deleteAction }: ProductImageManagerProps) {
  const [uploadState, uploadFormAction] = useActionState<ProductFormState, FormData>(uploadAction, {});
  const [updateState, updateFormAction] = useActionState<ProductFormState, FormData>(updateAction, {});
  const [rows, setRows] = useState(
    () => images.map((image) => ({ ...image })).sort((a, b) => a.position - b.position),
  );

  function updateRow(id: string, field: "alt" | "position", value: string) {
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, [field]: field === "position" ? Number(value) : value } : row,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {rows.length > 0 && (
        <form action={updateFormAction} className="flex flex-col gap-4">
          <input
            type="hidden"
            name="imagesJson"
            value={JSON.stringify(rows.map(({ id, position, alt }) => ({ id, position, alt })))}
          />
          <FormMessage>{updateState.error}</FormMessage>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((image) => (
              <div key={image.id} className="flex flex-col gap-2 rounded-lg border border-steel bg-charcoal p-3">
                <div className="relative aspect-square overflow-hidden rounded-md bg-gunmetal">
                  <Image src={image.url} alt={image.alt} fill sizes="200px" className="object-cover" />
                </div>
                <Input
                  value={image.alt}
                  onChange={(event) => updateRow(image.id, "alt", event.target.value)}
                  placeholder="Alternatif metin"
                  aria-label="Görsel alternatif metni"
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-ash">
                    Sıra
                    <Input
                      type="number"
                      value={image.position}
                      onChange={(event) => updateRow(image.id, "position", event.target.value)}
                      className="h-8 w-16 px-2"
                      aria-label="Sıra"
                    />
                  </label>
                  <ConfirmDialog
                    trigger={
                      <button
                        type="button"
                        className="ml-auto flex size-8 items-center justify-center rounded-md text-ash-dim transition-colors hover:bg-gunmetal hover:text-stock-out"
                        aria-label="Görseli sil"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    }
                    title="Görseli sil"
                    description="Bu görsel kalıcı olarak silinecek."
                    action={deleteAction.bind(null, image.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          <SubmitButton variant="outline" className="self-start">
            Sırayı ve Metinleri Kaydet
          </SubmitButton>
        </form>
      )}

      <form action={uploadFormAction} className="flex flex-col gap-3 rounded-lg border border-dashed border-steel p-5">
        <FormMessage>{uploadState.error}</FormMessage>
        <label className="flex flex-col gap-2">
          <span className="font-display text-xs font-bold uppercase tracking-wide text-ash">
            Yeni Görsel Ekle
          </span>
          <input
            type="file"
            name="images"
            accept="image/png,image/jpeg,image/webp"
            multiple
            required
            className="text-sm text-ash file:mr-4 file:rounded-full file:border-0 file:bg-steel file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-optic hover:file:bg-steel-bright"
          />
        </label>
        <SubmitButton variant="outline" className="self-start">
          <Upload className="size-4" />
          Yükle
        </SubmitButton>
      </form>
    </div>
  );
}
