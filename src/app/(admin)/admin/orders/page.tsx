import { getPaginatedOrders } from "@/app/actions/admin/orders";
import OrdersList from "@/components/admin/OrdersList";

export default async function OrdersPage() {
  const { orders, totalPages } = await getPaginatedOrders(1);
  return <OrdersList initialOrders={orders} totalPages={totalPages} />;
}
