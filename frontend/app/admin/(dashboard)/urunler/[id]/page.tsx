import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { Button } from "@/components/ui/button";
import { AdminApiError } from "@/lib/admin/api";
import { getAdminBrands, getAdminCategories, getAdminProduct } from "@/lib/admin/data";
import {
  deleteProduct,
  deleteProductImage,
  updateProduct,
  updateProductImages,
  uploadProductImages,
} from "../actions";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  let product;
  try {
    [product] = await Promise.all([getAdminProduct(id)]);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound();
    throw error;
  }

  const [categories, brands] = await Promise.all([getAdminCategories(), getAdminBrands()]);

  return (
    <div>
      <PageHeader
        title={product.name}
        description={`SKU: ${product.sku}`}
        action={
          <ConfirmDialog
            trigger={
              <Button variant="outline" className="border-stock-out/50 text-stock-out hover:border-stock-out hover:text-stock-out">
                <Trash2 className="size-4" />
                Ürünü Sil
              </Button>
            }
            title="Ürünü sil"
            description={`"${product.name}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
            action={deleteProduct.bind(null, product.id)}
          />
        }
      />

      <div className="mb-10">
        <h2 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.15em] text-ash">Görseller</h2>
        <ProductImageManager
          productId={product.id}
          images={product.images}
          uploadAction={uploadProductImages.bind(null, product.id)}
          updateAction={updateProductImages.bind(null, product.id)}
          deleteAction={deleteProductImage.bind(null, product.id)}
        />
      </div>

      <ProductForm
        action={updateProduct.bind(null, product.id)}
        categories={categories}
        brands={brands}
        defaultValues={product}
        submitLabel="Değişiklikleri Kaydet"
      />
    </div>
  );
}
