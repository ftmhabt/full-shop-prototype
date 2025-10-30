"use server";
import { ORDERS_PAGE_SIZE } from "@/constants/home";
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
      shippingMethod: true,
    },
  });

  return orders;
}

export async function getPaginatedOrders(page: number) {
  const totalCount = await db.order.count();

  const orders = await db.order.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      shippingMethod: {
        select: {
          id: true,
          name: true,
          cost: true,
        },
      },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * ORDERS_PAGE_SIZE,
    take: ORDERS_PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / ORDERS_PAGE_SIZE));

  return { orders, totalPages };
}
