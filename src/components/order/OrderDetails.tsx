"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { ShoppingCart } from "lucide-react";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export default function OrderDetailsClient({
  order,
}: {
  order: OrderWithItems;
}) {
  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" /> جزئیات سفارش #
        {order.id.slice(0, 8)}
      </h1>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>وضعیت سفارش</CardTitle>
          <Badge className={statusColor[order.status]}>{order.status}</Badge>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
          </p>
          <p>جمع کالاها: {order.totalPrice.toLocaleString("fa-IR")} تومان</p>
          <p>هزینه ارسال: {order.shippingCost.toLocaleString("fa-IR")} تومان</p>
          <p>تخفیف: {order.discount.toLocaleString("fa-IR")} تومان</p>
          <p>مبلغ نهایی: {order.finalPrice.toLocaleString("fa-IR")} تومان</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>آدرس دریافت سفارش</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>
            {order.fullName} - {order.phone}
          </p>
          <p>
            {order.province}, {order.city}
          </p>
          <p>{order.address}</p>
          <p>کد پستی: {order.postalCode || "ثبت نشده"}</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>آیتم‌های سفارش</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {order.items.length > 0 ? (
            <ul className="space-y-1">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between border-b pb-1"
                >
                  <span>محصول {item.productId}</span>
                  <span>تعداد: {item.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">آیتمی ثبت نشده است.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
