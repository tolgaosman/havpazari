import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminApiError } from "@/lib/admin/api";
import { getAdminCategory } from "@/lib/admin/data";
import { updateCategory } from "../actions";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  let category;
  try {
    category = await getAdminCategory(id);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div>
      <PageHeader title={category.name} />
      <CategoryForm action={updateCategory.bind(null, category.id)} defaultValues={category} submitLabel="Değişiklikleri Kaydet" />
    </div>
  );
}
