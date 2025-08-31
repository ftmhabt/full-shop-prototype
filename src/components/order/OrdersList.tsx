"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order, OrderItem } from "@prisma/client";
import { Package } from "lucide-react";
import Link from "next/link";

type OrderWithItems = Order & {
  items: (OrderItem & { productName: string })[];
};

export default function OrdersList({ orders }: { orders: OrderWithItems[] }) {
  const statusColor: Record<Order["status"], string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
  };

  if (orders.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Package className="w-6 h-6" /> سفارش‌های من
      </h1>

      {orders.map((order) => (
        <Link
          key={order.id}
          href={"/dashboard/orders/" + order.id}
          className="block"
        >
          <Card className="rounded-xl shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-base">
                سفارش #{order.id.slice(0, 8)}
              </CardTitle>
              <Badge className={statusColor[order.status]}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <p>
                  تاریخ:{" "}
                  {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="font-semibold">
                  مبلغ: {order.finalPrice.toLocaleString("fa-IR")} تومان
                </p>
              </div>

              {/* نمایش آیتم‌ها */}
              <div className="text-xs text-gray-500 space-y-1">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.productName} × {item.quantity}
                  </p>
                ))}
              </div>

              {/* آدرس سفارش (اختیاری) */}
              {order.address && (
                <p className="text-xs text-gray-500">
                  آدرس: {order.province}، {order.city}، {order.address}...
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
