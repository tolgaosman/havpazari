import { Trash2 } from "lucide-react";
import { BrandDialog } from "@/components/admin/BrandDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormMessage } from "@/components/admin/FormMessage";
import { NotConfiguredNotice } from "@/components/admin/NotConfiguredNotice";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminApiNotConfiguredError } from "@/lib/admin/api";
import { getAdminBrands } from "@/lib/admin/data";
import { createBrand, deleteBrand, updateBrand } from "./actions";

interface BrandsPageProps {
  searchParams: Promise<{ hata?: string }>;
}

export default async function AdminBrandsPage({ searchParams }: BrandsPageProps) {
  const { hata } = await searchParams;

  const brands = await getAdminBrands().catch((error) => {
    if (error instanceof AdminApiNotConfiguredError) return null;
    throw error;
  });

  if (brands === null) {
    return (
      <div>
        <PageHeader title="Markalar" />
        <NotConfiguredNotice />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Markalar"
        description={`${brands.length} marka`}
        action={<BrandDialog action={createBrand} />}
      />

      <div className="mb-6">
        <FormMessage>{hata}</FormMessage>
      </div>

      <div className="overflow-x-auto rounded-lg border border-steel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-steel bg-charcoal text-xs uppercase tracking-wide text-ash">
            <tr>
              <th className="px-4 py-3 font-medium">Marka</th>
              <th className="px-4 py-3 font-medium">Menşei</th>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b border-steel last:border-0">
                <td className="px-4 py-3 font-medium text-optic">{brand.name}</td>
                <td className="px-4 py-3 text-ash">{brand.country}</td>
                <td className="px-4 py-3 text-ash">{brand.productCount ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <BrandDialog action={updateBrand.bind(null, brand.id)} brand={brand} />
                    <ConfirmDialog
                      trigger={
                        <button
                          type="button"
                          className="flex size-9 items-center justify-center rounded-md text-ash-dim transition-colors hover:bg-gunmetal hover:text-stock-out"
                          aria-label={`"${brand.name}" markasını sil`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      }
                      title="Markayı sil"
                      description={`"${brand.name}" kalıcı olarak silinecek.`}
                      action={deleteBrand.bind(null, brand.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
