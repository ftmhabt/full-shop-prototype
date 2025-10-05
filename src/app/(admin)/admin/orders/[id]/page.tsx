import OrderDetails from "@/components/admin/OrderDetails";
import db from "@/lib/db";

export default async function OrderPage({ params }: any) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: { include: { product: true } },
      ShippingMethod: true,
      OrderLog: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    return <div className="p-6">سفارشی پیدا نشد</div>;
  }
  const standardizedOrder = {
    ...order,
    items: await Promise.all(
      order.items.map(async (i) => ({
        ...i,
        product: {
          ...i.product,
          price: i.product.price.toNumber(),
        },
        price: i.price.toNumber(),
      }))
    ),
  };

  return <OrderDetails order={standardizedOrder} />;
}
