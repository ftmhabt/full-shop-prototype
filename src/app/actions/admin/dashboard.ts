"use server";

import db from "@/lib/db";
import { subDays } from "date-fns";

export async function getDashboardStats() {
  const [totalUsers, totalOrders, pendingOrders, totalProducts, totalRevenue] =
    await Promise.all([
      db.user.count(),
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.product.count(),
      db.order.aggregate({
        _sum: { finalPrice: true },
        where: { status: "COMPLETED" },
      }),
    ]);

  return {
    totalUsers,
    totalOrders,
    pendingOrders,
    totalProducts,
    totalRevenue: totalRevenue._sum.finalPrice ?? 0,
  };
}

export async function getRecentOrders() {
  const orders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return orders.map((order) => ({
    id: order.id,
    customer: order.user?.displayName || order.fullName || "کاربر ناشناس",
    total: order.finalPrice,
    status: order.status,
    createdAt: order.createdAt,
  }));
}

export async function getRevenueTrend() {
  const start = subDays(new Date(), 30);

  const dailySales = await db.$queryRaw<{ date: string; total: number }[]>`
  SELECT TO_CHAR("deliveredAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tehran', 'YYYY-MM-DD HH24:MI') AS date,
       SUM("finalPrice") AS total
FROM "Order"
WHERE "status" = 'COMPLETED' AND "deliveredAt" >= ${start}
GROUP BY TO_CHAR("deliveredAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tehran', 'YYYY-MM-DD HH24:MI')
ORDER BY TO_CHAR("deliveredAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tehran', 'YYYY-MM-DD HH24:MI');

`;

  return dailySales;
}

export async function getTopProducts() {
  const products = await db.product.findMany({
    orderBy: { soldCount: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      soldCount: true,
      stock: true,
      price: true,
      image: true,
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    soldCount: p.soldCount,
    stock: p.stock,
    price: Number(p.price),
    image: p.image?.[0] || null,
  }));
}

export async function getNewUsers() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      displayName: true,
      phone: true,
      createdAt: true,
    },
  });

  return users.map((u) => ({
    id: u.id,
    displayName: u.displayName || "کاربر بدون نام",
    phone: u.phone,
    createdAt: u.createdAt,
  }));
}

export async function getLowStockProducts() {
  const products = await db.product.findMany({
    where: { stock: { lt: 5 } },
    orderBy: { stock: "asc" },
    take: 5,
    select: {
      id: true,
      name: true,
      stock: true,
      soldCount: true,
      image: true,
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    stock: p.stock,
    soldCount: p.soldCount,
    image: p.image?.[0] || null,
  }));
}

export async function getActiveDiscounts() {
  const discounts = await db.discount.findMany({
    where: {
      isActive: true,
      OR: [{ neverExpires: true }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return discounts.map((d) => ({
    id: d.id,
    code: d.code,
    description: d.description || "بدون توضیح",
    type: d.type,
    value: d.value,
    expiresAt: d.expiresAt,
    neverExpires: d.neverExpires,
  }));
}
