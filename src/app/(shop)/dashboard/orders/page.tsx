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

  const standardizedOrders = orders.map((order) => ({
    ...order,
    finalPrice: Number(order.finalPrice),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  }));

  return <OrdersList orders={standardizedOrders} />;
}
