"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import {
  orderStatusColor,
  orderStatusLabel,
  paymentStatusColor,
  paymentStatusLabel,
} from "@/lib/orderStatus";
import { OrderForDetails } from "@/types";
import { Hash, Home, MapPin, Package, Phone, Truck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OrderDetails({ order }: { order: OrderForDetails }) {
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
      <Card className="border rounded-xl shadow-sm hover:shadow-md transition">
        <CardHeader className="flex gap-2 items-center">
          <CardTitle className="text-base flex items-center gap-2 ml-auto">
            <Package className="w-5 h-5 text-gray-500" />
            سفارش #{order.id}
          </CardTitle>
          <Badge className={orderStatusColor[order.status]}>
            {orderStatusLabel[order.status]}
          </Badge>
          <Badge className={paymentStatusColor[order.paymentStatus]}>
            {paymentStatusLabel[order.paymentStatus]}
          </Badge>
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
                className="underline"
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
              {/* 1️⃣ Individual items */}
              {order.items
                .filter((item) => !item.bundleId)
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>
                      {new Intl.NumberFormat("fa-IR").format(
                        item.priceToman * item.quantity
                      )}{" "}
                      تومان
                    </span>
                  </li>
                ))}

              {/* 2️⃣ Bundled items */}
              {[
                ...new Set(order.items.map((i) => i.bundleId).filter(Boolean)),
              ].map((bundleId) => {
                const bundleItems = order.items.filter(
                  (i) => i.bundleId === bundleId
                );
                return (
                  <li key={bundleId} className="py-2 text-sm">
                    <span>دستگاه سفارشی {bundleItems[0].bundleLabel}</span>
                    <ul className="pl-4 mt-1 space-y-1 text-xs text-muted-foreground">
                      {bundleItems.map((i) => (
                        <li key={i.id} className="flex justify-between">
                          <span>
                            • {i.productName} × {i.quantity}
                          </span>
                          <span>
                            {new Intl.NumberFormat("fa-IR").format(
                              i.priceToman * i.quantity
                            )}{" "}
                            تومان
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">هیچ محصولی موجود نیست.</p>
          )}
        </CardContent>
      </Card>
      <Card className=" border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            روش ارسال
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm ">
          {order.shippingMethodName ? (
            <div className="flex justify-between border-b pb-1">
              <span>{order.shippingMethodName}</span>
              <span>{formatPrice(order.shippingCost || 0)} تومان</span>
            </div>
          ) : (
            <p className="text-gray-500">روش ارسال انتخاب نشده است.</p>
          )}
        </CardContent>
      </Card>

      {/* نمایش جمع کل و تخفیف */}
      <Card className="bg-gray-50 border">
        <CardContent className="text-sm text-gray-800 space-y-2">
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>تخفیف ({order.discountCode})</span>
              <span>- {formatPrice(order.discountAmount)} تومان</span>
            </div>
          )}

          <div className="flex justify-between font-bold border-t pt-2">
            <span>مبلغ قابل پرداخت</span>
            <span>{formatPrice(order.finalPrice)} تومان</span>
          </div>
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
