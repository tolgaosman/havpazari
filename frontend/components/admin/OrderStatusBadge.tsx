import { Badge, type BadgeProps } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/admin";

const VARIANT_BY_STATUS: Record<OrderStatus, BadgeProps["variant"]> = {
  pending: "outline",
  processing: "moss",
  shipped: "brass",
  delivered: "neutral",
  cancelled: "blaze",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANT_BY_STATUS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
