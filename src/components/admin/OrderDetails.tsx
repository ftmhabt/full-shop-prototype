"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import OrderStatusDropdown from "./OrderStatusDropdown";
import PaymentStatusDropdown from "./PaymentStatusDropdown";

export default function OrderDetails({ order }: { order: any }) {
  const totalPrice = order.items.reduce(
    (sum: number, i: any) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4 grid gap-4 md:grid-cols-3">
      {/* ستون اول: اطلاعات سفارش */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>📌 اطلاعات کاربر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>نام:</strong> {order.user.fullName}
            </p>
            <p>
              <strong>شماره تماس:</strong> {order.user.phone}
            </p>
            <p>
              <strong>آدرس:</strong> {order.address}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛒 محصولات سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{item.product.price.toLocaleString()} تومان</span>
                </div>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span>مجموع:</span>
              <span>{totalPrice.toLocaleString()} تومان</span>
            </div>
            <div className="flex justify-between text-destructive">
              <span>تخفیف:</span>
              <span>-{order.discount.toLocaleString()} تومان</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>مبلغ نهایی:</span>
              <span>{order.finalPrice.toLocaleString()} تومان</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>📦 تاریخچه وضعیت سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              {order.OrderLog ? (
                <ul className="space-y-2">
                  {order.OrderLog.map((log: any) => (
                    <li key={log.id} className="text-sm flex justify-between">
                      <span>{log.status}</span>
                      <span>
                        {new Date(log.createdAt).toLocaleString("fa-IR")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>وضعیت تغییری نداشته است</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ستون دوم: وضعیت‌ها */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>وضعیت سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusDropdown order={order} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>وضعیت پرداخت</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentStatusDropdown order={order} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>روش ارسال</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.ShippingMethod?.name}</p>
            <p>هزینه: {order.ShippingMethod?.cost.toLocaleString()} تومان</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
