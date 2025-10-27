import OrderDetails from "@/components/admin/OrderDetails";
import db from "@/lib/db";
import console from "console";

export default async function OrderPage({ params }: any) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: true,
      ShippingMethod: true,
      OrderLog: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    return <div className="p-6">سفارشی پیدا نشد</div>;
  }

  console.log("order", order);
  return <OrderDetails order={order} />;
}
