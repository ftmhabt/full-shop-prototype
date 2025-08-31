import OrdersList from "@/components/order/OrdersList";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function OrdersPage() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("کاربر یافت نشد");

  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const formattedOrders = orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      productName: item.product.name,
    })),
  }));

  return <OrdersList orders={formattedOrders} />;
}
