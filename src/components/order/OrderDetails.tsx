"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export default function OrderDetails({ order }: { order: OrderWithItems }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRetryPayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/payment/retry?orderId=${order.id}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "خطا در شروع پرداخت");
      }
    } catch (err) {
      console.error(err);
      alert("مشکلی پیش آمد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* اطلاعات سفارش */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>سفارش #{order.id}</span>
            <Badge
              className={
                order.status === "PAID"
                  ? "bg-green-500 text-white"
                  : order.status === "PENDING"
                  ? "bg-yellow-500 text-black"
                  : order.status === "SHIPPED"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-400 text-white"
              }
            >
              {order.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>تاریخ ثبت: {new Date(order.createdAt).toLocaleString("fa-IR")}</p>
          <p>مبلغ نهایی: {order.finalPrice.toLocaleString("fa-IR")} تومان</p>
          {order.status === "SHIPPED" && order.trackingCode && (
            <p>
              کد رهگیری:{" "}
              <a
                href={`https://tracking.post.ir/${order.trackingCode}`}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {order.trackingCode}
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      {/* آدرس */}
      <Card>
        <CardHeader>
          <CardTitle>آدرس ارسال</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          {order.fullName} - {order.phone} <br />
          {order.province}, {order.city} <br />
          {order.address} <br />
          کد پستی: {order.postalCode}
        </CardContent>
      </Card>

      {/* آیتم‌ها */}
      <Card>
        <CardHeader>
          <CardTitle>آیتم‌های سفارش</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-2 text-sm"
              >
                <span>
                  {item.productId} × {item.quantity}
                </span>
                <span>{item.quantity} عدد</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* دکمه‌ها */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href="/orders" className="flex-1">
          <Button variant="outline" className="w-full">
            بازگشت به سفارش‌ها
          </Button>
        </Link>

        {order.status === "PENDING" && (
          <Button
            onClick={handleRetryPayment}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "در حال انتقال..." : "پرداخت دوباره"}
          </Button>
        )}
      </div>
    </div>
  );
}
