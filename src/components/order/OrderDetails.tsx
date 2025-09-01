"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { Prisma } from "@prisma/client";
import { Hash, Home, MapPin, Package, Phone, Truck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    ShippingMethod: true;
  };
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

  const statusColor: Record<typeof order.status, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4 space-y-6">
      {/* اطلاعات سفارش */}
      <Card className="border rounded-xl shadow-sm hover:shadow-md transition">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-500" />
            سفارش #{order.id}
          </CardTitle>
          <Badge className={statusColor[order.status]}>{order.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>تاریخ ثبت: {new Date(order.createdAt).toLocaleString("fa-IR")}</p>
          <p>مبلغ نهایی: {formatPrice(order.finalPrice)} تومان</p>
          {order.status === "SHIPPED" && order.trackingCode && (
            <p>
              کد رهگیری:{" "}
              <a
                href={`https://tracking.post.ir/${order.trackingCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {order.trackingCode}
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      {/* آدرس */}
      <Card className="border rounded-xl shadow-sm hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4 text-gray-500" />
            آدرس ارسال
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1 text-gray-700">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span>{order.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{order.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>
              {order.province}, {order.city}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Home className="w-4 h-4 text-gray-500 mt-0.5" />
            <span>{order.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span>{order.postalCode || "ثبت نشده"}</span>
          </div>
        </CardContent>
      </Card>

      {/* آیتم‌های سفارش */}
      <Card className="border rounded-xl shadow-sm hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="w-4 h-4 text-gray-500" />
            آیتم‌های سفارش
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {order.items.length > 0 ? (
            <ul className="divide-y">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2 text-sm"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    {formatPrice(item.product.price * item.quantity)} تومان
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">هیچ محصولی موجود نیست.</p>
          )}
        </CardContent>
      </Card>
      <Card className="bg-gray-50 border">
        <CardHeader>
          <CardTitle className="text-gray-700 text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            روش ارسال
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-800">
          {order.ShippingMethod ? (
            <div className="flex justify-between border-b pb-1">
              <span>{order.ShippingMethod.name}</span>
              <span>{formatPrice(order.ShippingMethod.cost)} تومان</span>
            </div>
          ) : (
            <p className="text-gray-500">روش ارسال انتخاب نشده است.</p>
          )}
        </CardContent>
      </Card>
      {/* دکمه‌ها */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href="/dashboard/orders" className="flex-1">
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
