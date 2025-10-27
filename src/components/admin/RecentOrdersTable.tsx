"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentOrdersTable({
  orders,
}: {
  orders: {
    id: string;
    customer: string;
    total: number;
    status: string;
    createdAt: Date;
  }[];
}) {
  return (
    <Card className="col-span-2 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          آخرین سفارش‌ها
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between text-sm border-b py-2 last:border-0"
            >
              <div className="flex flex-col">
                <span className="font-medium">{o.customer}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <div className="text-left">
                <span className="block">{o.total.toLocaleString()} تومان</span>
                <span className="text-xs text-muted-foreground">
                  {translateStatus(o.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function translateStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "در انتظار پرداخت";
    case "PAID":
      return "پرداخت‌شده";
    case "SHIPPED":
      return "ارسال‌شده";
    case "COMPLETED":
      return "تکمیل‌شده";
    case "CANCELED":
      return "لغوشده";
    default:
      return status;
  }
}
