import Link from "next/link";
import { Plus } from "lucide-react";
import { NotConfiguredNotice } from "@/components/admin/NotConfiguredNotice";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminApiNotConfiguredError } from "@/lib/admin/api";
import { getAdminCategories, getAdminProducts } from "@/lib/admin/data";
import { formatPrice, stockPresentation } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ProductsPageProps {
  searchParams: Promise<{ ara?: string; kategoriId?: string; sayfa?: string }>;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const data = await Promise.all([
    getAdminProducts({
      q: params.ara,
      categoryId: params.kategoriId,
      page: params.sayfa ? Number(params.sayfa) : undefined,
    }),
    getAdminCategories(),
  ]).catch((error) => {
    if (error instanceof AdminApiNotConfiguredError) return null;
    throw error;
  });

  if (data === null) {
    return (
      <div>
        <PageHeader title="Ürünler" />
        <NotConfiguredNotice />
      </div>
    );
  }

  const [result, categories] = data;

  return (
    <div>
      <PageHeader
        title="Ürünler"
        description={`${result.meta.total} ürün`}
        action={
          <Button asChild>
            <Link href="/admin/urunler/yeni">
              <Plus className="size-4" />
              Yeni Ürün
            </Link>
          </Button>
        }
      />

      <form className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          name="ara"
          defaultValue={params.ara}
          placeholder="Ürün, SKU veya marka ara…"
          className="sm:max-w-xs"
        />
        <select
          name="kategoriId"
          defaultValue={params.kategoriId ?? ""}
          className="h-11 rounded-md border border-steel bg-gunmetal px-3.5 text-sm text-optic sm:max-w-xs"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Filtrele
        </Button>
      </form>

      {result.data.length === 0 ? (
        <p className="rounded-lg border border-dashed border-steel py-16 text-center text-sm text-ash">
          Bu filtrelerle eşleşen ürün yok.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-steel">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-steel bg-charcoal text-xs uppercase tracking-wide text-ash">
              <tr>
                <th className="px-4 py-3 font-medium">Ürün</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((product) => {
                const stock = stockPresentation(product.stockStatus);
                return (
                  <tr key={product.id} className="border-b border-steel last:border-0 hover:bg-charcoal">
                    <td className="px-4 py-3">
                      <Link href={`/admin/urunler/${product.id}`} className="block">
                        <span className="font-medium text-optic">{product.name}</span>
                        <span className="mt-0.5 block font-mono text-xs text-ash-dim">{product.sku}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ash">
                      {product.price !== null ? formatPrice(product.price) : "Fiyat için arayın"}
                    </td>
                    <td className="px-4 py-3 font-mono text-ash">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className={cn("size-2 rounded-full", stock.dotClassName)} aria-hidden="true" />
                        <span className={stock.textClassName}>{stock.label}</span>
                        {product.isFeatured && <Badge variant="brass">Öne Çıkan</Badge>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {result.meta.lastPage > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ash">
          Sayfa {result.meta.currentPage} / {result.meta.lastPage}
        </div>
      )}
    </div>
  );
}
