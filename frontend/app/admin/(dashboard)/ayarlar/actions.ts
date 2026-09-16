"use server";

import { AdminApiError, adminFetchJson } from "@/lib/admin/api";
import { revalidateSettings } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/session";
import type { OpeningHour } from "@/lib/site";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

const DAYS: OpeningHour["schemaDay"][] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const DAY_LABELS: Record<OpeningHour["schemaDay"], string> = {
  Mo: "Pazartesi",
  Tu: "Salı",
  We: "Çarşamba",
  Th: "Perşembe",
  Fr: "Cuma",
  Sa: "Cumartesi",
  Su: "Pazar",
};

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const openingHours = DAYS.map((day) => {
    const opens = field(formData, `opens_${day}`);
    const closes = field(formData, `closes_${day}`);
    return {
      schemaDay: day,
      label: DAY_LABELS[day],
      opens: opens || null,
      closes: closes || null,
    };
  });

  const announcements = formData.getAll("announcements").map(String).filter((value) => value.trim() !== "");

  const payload = {
    name: field(formData, "name"),
    shortName: field(formData, "shortName"),
    tagline: field(formData, "tagline"),
    description: field(formData, "description"),
    url: field(formData, "url"),
    contact: {
      phone: field(formData, "phone"),
      phoneDisplay: field(formData, "phoneDisplay"),
      mobile: field(formData, "mobile"),
      mobileDisplay: field(formData, "mobileDisplay"),
    },
    address: {
      street: field(formData, "street"),
      locality: field(formData, "locality"),
      region: field(formData, "region"),
      country: field(formData, "country"),
      countryCode: field(formData, "countryCode"),
      plusCode: field(formData, "plusCode"),
      full: field(formData, "full"),
    },
    mapsUrl: field(formData, "mapsUrl"),
    geo: {
      latitude: Number(field(formData, "latitude")),
      longitude: Number(field(formData, "longitude")),
    },
    openingHours,
    social: {
      facebook: field(formData, "facebook"),
      instagram: field(formData, "instagram"),
    },
    announcements,
  };

  try {
    await adminFetchJson("/admin/settings", "PUT", payload);
  } catch (error) {
    if (error instanceof AdminApiError) return { error: error.message };
    throw error;
  }

  revalidateSettings();
  return { success: true };
}
