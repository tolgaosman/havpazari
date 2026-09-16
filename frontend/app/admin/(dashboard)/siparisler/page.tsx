import Link from "next/link";
import { NotConfiguredNotice } from "@/components/admin/NotConfiguredNotice";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminApiNotConfiguredError } from "@/lib/admin/api";
import { getAdminOrders } from "@/lib/admin/data";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/admin";

interface OrdersPageProps {
  searchParams: Promise<{ durum?: string; sayfa?: string }>;
}

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][];

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  const result = await getAdminOrders({
    status: params.durum,
    page: params.sayfa ? Number(params.sayfa) : undefined,
  }).catch((error) => {
    if (error instanceof AdminApiNotConfiguredError) return null;
    throw error;
  });

  if (result === null) {
    return (
      <div>
        <PageHeader title="Siparişler" />
        <NotConfiguredNotice />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Siparişler" description={`${result.meta.total} sipariş`} />

      <form className="mb-6 flex items-center gap-3">
        <select
          name="durum"
          defaultValue={params.durum ?? ""}
          className="h-11 rounded-md border border-steel bg-gunmetal px-3.5 text-sm text-optic"
        >
          <option value="">Tüm Durumlar</option>
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>

      {result.data.length === 0 ? (
        <p className="rounded-lg border border-dashed border-steel py-16 text-center text-sm text-ash">
          Sipariş bulunamadı.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-steel">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-steel bg-charcoal text-xs uppercase tracking-wide text-ash">
              <tr>
                <th className="px-4 py-3 font-medium">Sipariş No</th>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Tutar</th>
                <th className="px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((order) => (
                <tr key={order.id} className="border-b border-steel last:border-0 hover:bg-charcoal">
                  <td className="px-4 py-3">
                    <Link href={`/admin/siparisler/${order.id}`} className="font-medium text-optic hover:text-brass">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ash">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-ash">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
