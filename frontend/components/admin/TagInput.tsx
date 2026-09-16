"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  /** Formda gönderilecek hidden input'ların adı — `formData.getAll(name)` ile okunur. */
  name: string;
  defaultValue?: string[];
  placeholder?: string;
}

/** Etiket/chip girişi. Her etiket aynı isimli bir hidden input olarak render edilir. */
export function TagInput({ name, defaultValue = [], placeholder }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const value = draft.trim();
    if (value !== "" && !tags.includes(value)) {
      setTags((current) => [...current, value]);
    }
    setDraft("");
  }

  function removeTag(tag: string) {
    setTags((current) => current.filter((item) => item !== tag));
  }

  return (
    <div
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-2 rounded-md border border-steel bg-gunmetal px-3 py-2 focus-within:border-brass",
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 rounded-full bg-steel px-2.5 py-1 text-xs text-optic"
        >
          <input type="hidden" name={name} value={tag} />
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`"${tag}" etiketini kaldır`}
            className="text-ash-dim transition-colors hover:text-optic"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            commitDraft();
          } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
            const last = tags.at(-1);
            if (last !== undefined) removeTag(last);
          }
        }}
        onBlur={commitDraft}
        placeholder={tags.length === 0 ? placeholder : undefined}
        className="min-w-[8rem] flex-1 bg-transparent text-sm text-optic placeholder:text-ash-dim focus:outline-none"
      />
    </div>
  );
}
