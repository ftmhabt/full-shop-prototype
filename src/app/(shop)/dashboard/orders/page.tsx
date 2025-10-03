import OrdersList from "@/components/order/OrdersList";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { usdToToman } from "@/lib/exchange";

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

  const standardizedOrders = await Promise.all(
    orders.map(async (order) => ({
      ...order,
      finalPrice: Number(order.finalPrice),
      finalPriceToman: await usdToToman(Number(order.finalPrice)),
      items: await Promise.all(
        order.items.map(async (item) => ({
          ...item,
          price: Number(item.price),
          priceToman: await usdToToman(Number(item.price)),
          product: {
            ...item.product,
            price: Number(item.product.price),
            priceToman: await usdToToman(Number(item.product.price)),
          },
        }))
      ),
    }))
  );

  return <OrdersList orders={standardizedOrders} />;
}
