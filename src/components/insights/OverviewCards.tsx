"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, UserPlus } from "lucide-react";

interface Props {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    newUsers: number;
  };
}

export function OverviewCards({ stats }: Props) {
  const items = [
    {
      title: "درآمد کل (ماه جاری)",
      value: stats.totalRevenue.toLocaleString("fa-IR") + " تومان",
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "تعداد سفارش‌ها (ماه جاری)",
      value: stats.totalOrders.toLocaleString("fa-IR"),
      icon: <ShoppingBag className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "کاربران جدید",
      value: stats.newUsers.toLocaleString("fa-IR"),
      icon: <UserPlus className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 rtl">
      {items.map((item) => (
        <Card key={item.title} className="shadow-sm">
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
