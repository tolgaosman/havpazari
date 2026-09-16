"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/admin/FormMessage";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { TagInput } from "@/components/admin/TagInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormState } from "@/app/admin/(dashboard)/ayarlar/actions";
import type { SiteConfig } from "@/lib/site";

interface SettingsFormProps {
  action: (state: SettingsFormState, formData: FormData) => Promise<SettingsFormState>;
  settings: SiteConfig;
}

export function SettingsForm({ action, settings }: SettingsFormProps) {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <FormMessage>{state.error}</FormMessage>
      {state.success && <FormMessage type="success">Ayarlar kaydedildi.</FormMessage>}

      <Section title="İşletme">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="İşletme Adı" htmlFor="name">
            <Input id="name" name="name" defaultValue={settings.name} required />
          </Field>
          <Field label="Kısa Ad" htmlFor="shortName">
            <Input id="shortName" name="shortName" defaultValue={settings.shortName} required />
          </Field>
          <Field label="Slogan" htmlFor="tagline">
            <Input id="tagline" name="tagline" defaultValue={settings.tagline} required />
          </Field>
          <Field label="Site Adresi (URL)" htmlFor="url">
            <Input id="url" name="url" type="url" defaultValue={settings.url} required />
          </Field>
        </div>
        <Field label="Açıklama" htmlFor="description" className="mt-5">
          <Textarea id="description" name="description" rows={3} defaultValue={settings.description} required />
        </Field>
      </Section>

      <Section title="İletişim">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Telefon" htmlFor="phone" hint="Uluslararası biçim, ör. +90 542 000 00 00">
            <Input id="phone" name="phone" defaultValue={settings.contact.phone} required />
          </Field>
          <Field label="Telefon (görünen)" htmlFor="phoneDisplay">
            <Input id="phoneDisplay" name="phoneDisplay" defaultValue={settings.contact.phoneDisplay} required />
          </Field>
          <Field label="WhatsApp" htmlFor="mobile" hint="Uluslararası biçim, ör. +90 542 000 00 00">
            <Input id="mobile" name="mobile" defaultValue={settings.contact.mobile} required />
          </Field>
          <Field label="WhatsApp (görünen)" htmlFor="mobileDisplay">
            <Input id="mobileDisplay" name="mobileDisplay" defaultValue={settings.contact.mobileDisplay} required />
          </Field>
        </div>
      </Section>

      <Section title="Adres">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Sokak / Cadde" htmlFor="street">
            <Input id="street" name="street" defaultValue={settings.address.street} required />
          </Field>
          <Field label="Semt" htmlFor="locality">
            <Input id="locality" name="locality" defaultValue={settings.address.locality} required />
          </Field>
          <Field label="Bölge" htmlFor="region">
            <Input id="region" name="region" defaultValue={settings.address.region} required />
          </Field>
          <Field label="Ülke" htmlFor="country">
            <Input id="country" name="country" defaultValue={settings.address.country} required />
          </Field>
          <Field label="Ülke Kodu" htmlFor="countryCode">
            <Input id="countryCode" name="countryCode" defaultValue={settings.address.countryCode} required maxLength={5} />
          </Field>
          <Field label="Plus Code" htmlFor="plusCode">
            <Input id="plusCode" name="plusCode" defaultValue={settings.address.plusCode} />
          </Field>
        </div>
        <Field label="Tek Satır Adres" htmlFor="full" className="mt-5">
          <Input id="full" name="full" defaultValue={settings.address.full} required />
        </Field>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Google Maps Bağlantısı" htmlFor="mapsUrl" className="sm:col-span-3">
            <Input id="mapsUrl" name="mapsUrl" type="url" defaultValue={settings.mapsUrl} required />
          </Field>
          <Field label="Enlem" htmlFor="latitude">
            <Input id="latitude" name="latitude" type="number" step="any" defaultValue={settings.geo.latitude} required />
          </Field>
          <Field label="Boylam" htmlFor="longitude">
            <Input id="longitude" name="longitude" type="number" step="any" defaultValue={settings.geo.longitude} required />
          </Field>
        </div>
      </Section>

      <Section title="Çalışma Saatleri">
        <div className="flex flex-col gap-2">
          {settings.openingHours.map((hour) => (
            <div key={hour.schemaDay} className="grid grid-cols-[6rem_1fr_1fr] items-center gap-3">
              <span className="text-sm text-ash">{hour.label}</span>
              <Input type="time" name={`opens_${hour.schemaDay}`} defaultValue={hour.opens ?? ""} aria-label={`${hour.label} açılış`} />
              <Input type="time" name={`closes_${hour.schemaDay}`} defaultValue={hour.closes ?? ""} aria-label={`${hour.label} kapanış`} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ash-dim">Kapalı bir gün için her iki alanı da boş bırakın.</p>
      </Section>

      <Section title="Sosyal Medya">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Facebook" htmlFor="facebook">
            <Input id="facebook" name="facebook" type="url" defaultValue={settings.social.facebook} />
          </Field>
          <Field label="Instagram" htmlFor="instagram">
            <Input id="instagram" name="instagram" type="url" defaultValue={settings.social.instagram} />
          </Field>
        </div>
      </Section>

      <Section title="Duyuru Bandı">
        <TagInput name="announcements" defaultValue={settings.announcements} placeholder="Duyuru yazıp Enter'a basın…" />
      </Section>

      <div>
        <SubmitButton size="lg">Ayarları Kaydet</SubmitButton>
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
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-ash-dim">{hint}</p>}
    </div>
  );
}
