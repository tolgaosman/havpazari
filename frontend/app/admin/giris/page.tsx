"use client";

import { useActionState } from "react";
import { Crosshair } from "lucide-react";
import { FormMessage } from "@/components/admin/FormMessage";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginState } from "@/lib/admin/session";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <Crosshair className="size-8 text-brass" strokeWidth={1.75} aria-hidden="true" />
          <span className="font-display text-xl font-bold uppercase tracking-wider text-optic">
            Hasan Av Dünyası
          </span>
          <p className="mt-4 font-display text-2xl font-bold uppercase text-optic">
            Hoş geldin Hasan
          </p>
        </div>

        <form action={formAction} className="mt-8 flex flex-col gap-5">
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" name="password" type="password" autoFocus autoComplete="current-password" />
          </div>

          <FormMessage>{state.error}</FormMessage>

          <SubmitButton size="lg" className="w-full">
            Giriş Yap
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
