"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubmitButton } from "./SubmitButton";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Bağlanmış bir server action (ör. `deleteProduct.bind(null, product.id)`). */
  action: () => Promise<void>;
}

/** Silme gibi geri alınamaz işlemler için onay diyaloğu. */
export function ConfirmDialog({ trigger, title, description, confirmLabel = "Sil", action }: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        <form action={action} className="mt-6 flex justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Vazgeç
            </Button>
          </DialogClose>
          <SubmitButton className="bg-blaze text-optic hover:bg-blaze/85">{confirmLabel}</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
