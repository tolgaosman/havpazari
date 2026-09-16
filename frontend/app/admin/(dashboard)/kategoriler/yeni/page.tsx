import { CategoryForm } from "@/components/admin/CategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <PageHeader title="Yeni Kategori" />
      <CategoryForm action={createCategory} submitLabel="Kategoriyi Kaydet" />
    </div>
  );
}
