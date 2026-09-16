import Link from "next/link";
import { NotConfiguredNotice } from "@/components/admin/NotConfiguredNotice";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { formatPrice } from "@/lib/format";
import { AdminApiNotConfiguredError } from "@/lib/admin/api";
import { getDashboardStats } from "@/lib/admin/data";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats().catch((error) => {
    if (error instanceof AdminApiNotConfiguredError) return null;
    throw error;
  });

  if (stats === null) {
    return (
      <div>
        <PageHeader title="Panel" />
        <NotConfiguredNotice />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Panel" description="Mağazanın genel durumu." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Toplam Ürün" value={stats.productCount} href="/admin/urunler" />
        <StatCard
          label="Tükenen"
          value={stats.outOfStockCount}
          tone={stats.outOfStockCount > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Son Birkaç Adet"
          value={stats.lowStockCount}
          tone={stats.lowStockCount > 0 ? "warning" : "default"}
        />
        <StatCard label="Bekleyen Sipariş" value={stats.pendingOrderCount} href="/admin/siparisler" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.15em] text-ash">
            Düşük Stok
          </h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-ash-dim">Şu an düşük stoklu ürün yok.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.lowStockProducts.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/urunler/${product.id}`}
                    className="flex items-center justify-between rounded-md border border-steel bg-charcoal px-4 py-3 text-sm transition-colors hover:border-brass"
                  >
                    <span className="text-optic">{product.name}</span>
                    <span className="font-mono text-stock-low">{product.stock} adet</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.15em] text-ash">
            Son Siparişler
          </h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-ash-dim">Henüz sipariş yok.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/siparisler/${order.id}`}
                    className="flex items-center justify-between rounded-md border border-steel bg-charcoal px-4 py-3 text-sm transition-colors hover:border-brass"
                  >
                    <span className="flex flex-col">
                      <span className="text-optic">{order.orderNumber}</span>
                      <span className="text-xs text-ash-dim">{formatPrice(order.totalAmount)}</span>
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
