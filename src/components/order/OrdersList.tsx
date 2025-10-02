"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  orderStatusColor,
  orderStatusLabel,
  paymentStatusColor,
  paymentStatusLabel,
} from "@/lib/orderStatus";
import { Order, OrderItem } from "@prisma/client";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: {
      id: string;
      name: string;
    };
  })[];
};

export default function OrdersList({ orders }: { orders: OrderWithItems[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
        <Package className="w-6 h-6" /> سفارش‌های من
      </h1>

      {orders.map((order) => {
        // Group items by bundleId (or item id if not bundled)
        const groupedItems = order.items.reduce<
          Record<string, typeof order.items>
        >((acc, item) => {
          const key = item.bundleId || item.id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        return (
          <Card
            key={order.id}
            className="rounded-xl shadow-sm hover:shadow-lg transition p-4"
          >
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2 pl-2">
              <CardTitle className="text-base">سفارش #{order.id}</CardTitle>
              <div className="flex gap-2">
                <Badge className={orderStatusColor[order.status]}>
                  {orderStatusLabel[order.status]}
                </Badge>

                <Badge className={paymentStatusColor[order.paymentStatus]}>
                  {paymentStatusLabel[order.paymentStatus]}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="text-sm text-gray-600 space-y-3 px-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
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
                {Object.values(groupedItems).map((group, idx) => {
                  const isBundle =
                    group.length > 1 || group[0].bundleId !== null;
                  return (
                    <div key={idx} className="space-y-1">
                      {isBundle && (
                        <p className="font-medium">
                          {group[0].bundleLabel || "سفارشی"}:
                        </p>
                      )}
                      {group.map((item) => (
                        <p
                          key={item.id}
                          className={`flex justify-between ${
                            isBundle ? "pl-4" : ""
                          }`}
                        >
                          <span>
                            {!isBundle
                              ? item.product.name
                              : "• " + item.product.name}{" "}
                            × {item.quantity}
                          </span>
                          <span>
                            {new Intl.NumberFormat("fa-IR").format(
                              item.price.toNumber() * item.quantity
                            )}{" "}
                            تومان
                          </span>
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                {/* آدرس سفارش (اختیاری) */}
                {order.address && (
                  <p className="text-xs text-gray-500">
                    آدرس: {order.province}، {order.city}، {order.address}...
                  </p>
                )}

                {/* دکمه مشاهده جزئیات */}
                <div className="mt-2">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button className="flex items-center gap-1">
                      مشاهده جزئیات <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
