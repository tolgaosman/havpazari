import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminBrands, getAdminCategories } from "@/lib/admin/data";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getAdminCategories(), getAdminBrands()]);

  return (
    <div>
      <PageHeader title="Yeni Ürün" description="Kaydettikten sonra görsel ekleyebilirsiniz." />
      <ProductForm action={createProduct} categories={categories} brands={brands} submitLabel="Ürünü Kaydet" />
    </div>
  );
}
