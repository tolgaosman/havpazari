import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminApiError } from "@/lib/admin/api";
import { getAdminOrder } from "@/lib/admin/data";
import { formatDate, formatPrice } from "@/lib/format";
import { updateOrder } from "../actions";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  let order;
  try {
    order = await getAdminOrder(id);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div>
      <PageHeader title={order.orderNumber} description={formatDate(order.createdAt)} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.15em] text-ash">Kalemler</h2>
            <div className="overflow-x-auto rounded-lg border border-steel">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-steel bg-charcoal text-xs uppercase tracking-wide text-ash">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ürün</th>
                    <th className="px-4 py-3 font-medium">Adet</th>
                    <th className="px-4 py-3 font-medium">Birim Fiyat</th>
                    <th className="px-4 py-3 font-medium">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items ?? []).map((item) => (
                    <tr key={item.id} className="border-b border-steel last:border-0">
                      <td className="px-4 py-3">
                        <span className="block text-optic">{item.productName}</span>
                        <span className="block font-mono text-xs text-ash-dim">{item.productSku}</span>
                      </td>
                      <td className="px-4 py-3 text-ash">{item.quantity}</td>
                      <td className="px-4 py-3 text-ash">{formatPrice(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-optic">{formatPrice(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-display text-xs font-bold uppercase text-ash">
                      Toplam
                    </td>
                    <td className="px-4 py-3 font-display text-base font-bold text-optic">
                      {formatPrice(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.15em] text-ash">Teslimat Adresi</h2>
            <div className="rounded-lg border border-steel bg-charcoal p-4 text-sm text-ash">
              <p className="text-optic">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.line1}</p>
              <p>
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
            </div>
          </section>
        </div>

        <OrderStatusForm order={order} action={updateOrder.bind(null, order.id)} />
      </div>
    </div>
  );
}
