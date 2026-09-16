"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] rota hatası:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <TriangleAlert className="size-10 text-blaze" aria-hidden="true" strokeWidth={1.5} />
      <div>
        <h1 className="font-display text-lg font-bold uppercase text-optic">Bir Şeyler Ters Gitti</h1>
        <p className="mt-2 max-w-md text-sm text-ash">{error.message || "Beklenmedik bir hata oluştu."}</p>
      </div>
      <Button onClick={reset}>Tekrar Dene</Button>
    </div>
  );
}
