import OrdersList from "@/components/admin/OrdersList";
import db from "@/lib/db";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      ShippingMethod: {
        select: {
          id: true,
          name: true,
          cost: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <OrdersList orders={orders} />;
}
