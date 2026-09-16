"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductSpec } from "@/types";

interface SpecsEditorProps {
  /** Formda gönderilecek hidden alanın adı — değer JSON dizi. */
  name: string;
  defaultValue?: ProductSpec[];
}

/** Ürün teknik föyü — satır satır etiket/değer. Tek bir hidden JSON alana yazılır. */
export function SpecsEditor({ name, defaultValue = [] }: SpecsEditorProps) {
  const [specs, setSpecs] = useState<ProductSpec[]>(defaultValue);

  function updateRow(index: number, field: keyof ProductSpec, value: string) {
    setSpecs((current) =>
      current.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
    );
  }

  function addRow() {
    setSpecs((current) => [...current, { label: "", value: "" }]);
  }

  function removeRow(index: number) {
    setSpecs((current) => current.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={JSON.stringify(specs)} />

      {specs.length === 0 && (
        <p className="text-sm text-ash-dim">Henüz teknik özellik eklenmedi.</p>
      )}

      {specs.map((spec, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={spec.label}
            onChange={(event) => updateRow(index, "label", event.target.value)}
            placeholder="Örn. Ağırlık"
            className="flex-1"
            aria-label="Özellik etiketi"
          />
          <Input
            value={spec.value}
            onChange={(event) => updateRow(index, "value", event.target.value)}
            placeholder="Örn. 850 g"
            className="flex-1"
            aria-label="Özellik değeri"
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            aria-label="Satırı sil"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-ash-dim transition-colors hover:bg-gunmetal hover:text-stock-out"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addRow} className="self-start">
        <Plus className="size-4" />
        Özellik Ekle
      </Button>
    </div>
  );
}
