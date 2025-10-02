"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import OrderStatusDropdown from "./OrderStatusDropdown";
import PaymentStatusDropdown from "./PaymentStatusDropdown";

type BundleGroup = {
  bundleId: string;
  label: string | null;
  items: {
    id: string;
    product: { name: string; slug: string };
    price: number;
    quantity: number;
    bundleId?: string;
    bundleLabel?: string;
  }[];
};
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    ShippingMethod: true;
    OrderLog: true;
    user: true;
  };
}>;
export default function OrderDetails({ order }: { order: OrderWithItems }) {
  // Group items
  const individualItems = order.items.filter((i) => !i.bundleId);

  const bundleGroups: BundleGroup[] = Object.values(
    order.items
      .filter((i) => i.bundleId)
      .reduce((acc: Record<string, BundleGroup>, item) => {
        if (!acc[item.bundleId!]) {
          acc[item.bundleId!] = {
            bundleId: item.bundleId!,
            label: item.bundleLabel ?? "بسته سفارشی",
            items: [],
          };
        }
        acc[item.bundleId!].items.push({
          id: item.id,
          product: { name: item.product.name, slug: item.product.slug },
          price: item.price.toNumber(),
          quantity: item.quantity,
          bundleId: item.bundleId ?? undefined,
          bundleLabel: item.bundleLabel ?? undefined,
        });
        return acc;
      }, {} as Record<string, BundleGroup>)
  );

  // Calculate totals
  const totalPrice = order.items.reduce(
    (sum: number, i: any) => sum + i.product.price.toNumber() * i.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4 grid gap-4 md:grid-cols-3">
      {/* ستون اول: اطلاعات سفارش */}
      <div className="md:col-span-2 space-y-4">
        {/* اطلاعات کاربر */}
        <Card>
          <CardHeader>
            <CardTitle>📌 اطلاعات کاربر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>نام:</strong> {order.fullName}
            </p>
            <p>
              <strong>شماره تماس:</strong> {order.user.phone}
            </p>
            <p>
              <strong>آدرس:</strong> {order.address}
            </p>
          </CardContent>
        </Card>

        {/* محصولات سفارش */}
        <Card>
          <CardHeader>
            <CardTitle>🛒 آیتم‌های سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* 1️⃣ نمایش محصولات تکی */}
              {individualItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <Link
                    href={`/product/${item.product.id}`}
                    className="cursor-pointer"
                  >
                    {item.product.name} × {item.quantity}
                  </Link>
                  <span>
                    {(item.price.toNumber() * item.quantity).toLocaleString()}{" "}
                    تومان
                  </span>
                </div>
              ))}

              {/* 2️⃣ نمایش باندل‌ها */}
              {bundleGroups.map((bundle) => (
                <div key={bundle.bundleId} className="border-b pb-2">
                  <p className="font-medium text-sm">{bundle.label}</p>
                  <ul className="pl-4 mt-1 space-y-1 text-xs text-muted-foreground">
                    {bundle.items.map((i: any) => (
                      <li key={i.id} className="flex justify-between">
                        <Link href={`/product/${i.product.slug}`}>
                          • {i.product.name} × {i.quantity}
                        </Link>
                        <span>
                          {(i.price.toNumber() * i.quantity).toLocaleString()}{" "}
                          تومان
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* 3️⃣ جمع کل و تخفیف */}
            <div className="flex justify-between mt-2">
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

        {/* تاریخچه وضعیت سفارش */}
        <Card>
          <CardHeader>
            <CardTitle>📦 تاریخچه وضعیت سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              {order.OrderLog?.length > 0 ? (
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
