"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/admin/FormMessage";
import { SpecsEditor } from "@/components/admin/SpecsEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { TagInput } from "@/components/admin/TagInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormState } from "@/app/admin/(dashboard)/urunler/actions";
import type { AdminBrand, AdminCategory, AdminProduct } from "@/types/admin";

interface ProductFormProps {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: AdminCategory[];
  brands: AdminBrand[];
  defaultValues?: AdminProduct;
  submitLabel: string;
}

export function ProductForm({ action, categories, brands, defaultValues, submitLabel }: ProductFormProps) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(action, {});

  function error(field: string) {
    return state.fieldErrors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <FormMessage>{state.error}</FormMessage>

      <Section title="Temel Bilgi">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Ürün Adı" htmlFor="name" error={error("name")}>
            <Input id="name" name="name" defaultValue={defaultValues?.name} required />
          </Field>
          <Field label="Bağlantı (slug)" htmlFor="slug" error={error("slug")} hint="Boş bırakılırsa addan üretilir.">
            <Input id="slug" name="slug" defaultValue={defaultValues?.slug} />
          </Field>
          <Field label="Stok Kodu (SKU)" htmlFor="sku" error={error("sku")}>
            <Input id="sku" name="sku" defaultValue={defaultValues?.sku} required />
          </Field>
          <Field label="Kategori" htmlFor="categoryId" error={error("categoryId")}>
            <Select id="categoryId" name="categoryId" defaultValue={defaultValues?.categoryId} required>
              <option value="" disabled>
                Seçin…
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Marka" htmlFor="brandId" error={error("brandId")}>
            <Select id="brandId" name="brandId" defaultValue={defaultValues?.brandId} required>
              <option value="" disabled>
                Seçin…
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Kısa Açıklama" htmlFor="shortDescription" error={error("shortDescription")} className="mt-5">
          <Input id="shortDescription" name="shortDescription" defaultValue={defaultValues?.shortDescription} required />
        </Field>

        <Field label="Açıklama" htmlFor="description" error={error("description")} className="mt-5">
          <Textarea id="description" name="description" rows={5} defaultValue={defaultValues?.description} required />
        </Field>
      </Section>

      <Section title="Fiyat & Stok">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Fiyat (₺)" htmlFor="price" error={error("price")} hint="Boş bırakılırsa 'Fiyat için arayın' gösterilir.">
            <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={defaultValues?.price ?? ""} />
          </Field>
          <Field label="İndirim Öncesi Fiyat (₺)" htmlFor="compareAtPrice" error={error("compareAtPrice")}>
            <Input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={defaultValues?.compareAtPrice ?? ""}
            />
          </Field>
          <Field label="Stok Adedi" htmlFor="stock" error={error("stock")}>
            <Input id="stock" name="stock" type="number" min="0" defaultValue={defaultValues?.stock ?? 0} required />
          </Field>
        </div>
      </Section>

      <Section title="Durum">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SwitchField name="isOrderOnly" label="Siparişle Temin Edilir" defaultChecked={defaultValues?.isOrderOnly} />
          <SwitchField name="requiresLicense" label="Ruhsatlı Ürün (fiyat gizlenir)" defaultChecked={defaultValues?.requiresLicense} />
          <SwitchField name="isFeatured" label="Öne Çıkan" defaultChecked={defaultValues?.isFeatured} />
          <SwitchField name="isNew" label="Yeni" defaultChecked={defaultValues?.isNew} />
        </div>
      </Section>

      <Section title="Teknik Özellikler">
        <SpecsEditor name="specsJson" defaultValue={defaultValues?.specs} />
      </Section>

      <Section title="Etiketler">
        <TagInput name="tags" defaultValue={defaultValues?.tags} placeholder="Etiket yazıp Enter'a basın…" />
      </Section>

      <div>
        <SubmitButton size="lg">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.15em] text-ash">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ash-dim">{hint}</p>}
      {error && <p className="mt-1 text-xs text-stock-out">{error}</p>}
    </div>
  );
}

function SwitchField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-steel bg-charcoal px-4 py-3">
      <span className="text-sm text-optic">{label}</span>
      <Switch name={name} defaultChecked={defaultChecked} />
    </label>
  );
}
