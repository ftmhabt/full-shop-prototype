"use server";

import db from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";

export async function getDashboardStats() {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const [orders, users, revenue] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: start, lte: end } } }),
    db.user.count({ where: { createdAt: { gte: start, lte: end } } }),
    db.order.aggregate({
      _sum: { finalPrice: true },
      where: { createdAt: { gte: start, lte: end }, status: "COMPLETED" },
    }),
  ]);

  return {
    totalOrders: orders,
    newUsers: users,
    totalRevenue: revenue._sum.finalPrice || 0,
  };
}

export async function getSalesTrend() {
  const results = await db.$queryRaw<
    { day: string; total: number }[]
  >`SELECT DATE("createdAt") as day, SUM("finalPrice") as total
     FROM "Order"
     WHERE "status" = 'COMPLETED'
     GROUP BY day
     ORDER BY day ASC`;

  return results.map((r) => ({ day: r.day, total: Number(r.total) }));
}

export async function getOrdersByStatus() {
  const result = await db.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  return result.map((r) => ({ status: r.status, count: r._count.status }));
}
