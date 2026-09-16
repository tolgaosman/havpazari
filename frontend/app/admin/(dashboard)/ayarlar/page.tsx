import { NotConfiguredNotice } from "@/components/admin/NotConfiguredNotice";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminApiNotConfiguredError } from "@/lib/admin/api";
import { getAdminSettings } from "@/lib/admin/data";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings().catch((error) => {
    if (error instanceof AdminApiNotConfiguredError) return null;
    throw error;
  });

  if (settings === null) {
    return (
      <div>
        <PageHeader title="Site Ayarları" />
        <NotConfiguredNotice />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Site Ayarları" description="Telefon, adres, çalışma saatleri ve duyurular." />
      <SettingsForm action={updateSettings} settings={settings} />
    </div>
  );
}
