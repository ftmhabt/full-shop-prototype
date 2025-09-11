import db from "@/lib/db";

export async function getAllOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      items: {
        select: {
          id: true,
          productId: true,
          quantity: true,
        },
      },
      ShippingMethod: true,
    },
  });

  return orders;
}
