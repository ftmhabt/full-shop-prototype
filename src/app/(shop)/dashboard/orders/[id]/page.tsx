import OrderDetails from "@/components/order/OrderDetails";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { usdToToman } from "@/lib/exchange";

export default async function OrderDetailsPage({ params }: any) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("کاربر یافت نشد");

  const { id } = params;
  const order = await db.order.findFirst({
    where: { id, userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      ShippingMethod: true,
    },
  });

  if (!order) {
    return (
      <p className="text-center mt-10 text-destructive">سفارش یافت نشد.</p>
    );
  }

  const standardizedOrder = {
    ...order,
    items: await Promise.all(
      order.items.map(async (i) => ({
        ...i,
        product: {
          ...i.product,
          price: i.product.price.toNumber(),
          priceToman: await usdToToman(i.product.price.toNumber()),
        },
        price: i.price.toNumber(),
        priceToman: await usdToToman(i.price.toNumber()),
      }))
    ),
  };

  return <OrderDetails order={standardizedOrder} />;
}
