import Image from "next/image";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormMessage } from "@/components/admin/FormMessage";
import { NotConfiguredNotice } from "@/components/admin/NotConfiguredNotice";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { AdminApiNotConfiguredError } from "@/lib/admin/api";
import { getAdminCategories } from "@/lib/admin/data";
import { deleteCategory } from "./actions";

interface CategoriesPageProps {
  searchParams: Promise<{ hata?: string }>;
}

export default async function AdminCategoriesPage({ searchParams }: CategoriesPageProps) {
  const { hata } = await searchParams;

  const categories = await getAdminCategories().catch((error) => {
    if (error instanceof AdminApiNotConfiguredError) return null;
    throw error;
  });

  if (categories === null) {
    return (
      <div>
        <PageHeader title="Kategoriler" />
        <NotConfiguredNotice />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Kategoriler"
        description={`${categories.length} kategori`}
        action={
          <Button asChild>
            <Link href="/admin/kategoriler/yeni">
              <Plus className="size-4" />
              Yeni Kategori
            </Link>
          </Button>
        }
      />

      <div className="mb-6">
        <FormMessage>{hata}</FormMessage>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col overflow-hidden rounded-lg border border-steel bg-charcoal">
            <div className="relative aspect-video bg-gunmetal">
              <Image src={category.imageUrl} alt={category.imageAlt} fill sizes="400px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <h3 className="font-display text-sm font-bold uppercase text-optic">{category.name}</h3>
                <p className="mt-1 text-xs text-ash-dim">
                  {category.productCount ?? 0} ürün · sıra {category.sortOrder}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/admin/kategoriler/${category.id}`}>Düzenle</Link>
                </Button>
                <ConfirmDialog
                  trigger={
                    <button
                      type="button"
                      className="flex size-9 shrink-0 items-center justify-center rounded-md text-ash-dim transition-colors hover:bg-gunmetal hover:text-stock-out"
                      aria-label={`"${category.name}" kategorisini sil`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  }
                  title="Kategoriyi sil"
                  description={`"${category.name}" kalıcı olarak silinecek.`}
                  action={deleteCategory.bind(null, category.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
