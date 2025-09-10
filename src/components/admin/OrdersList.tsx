"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import { useState } from "react";

type OrderWithUserAndShipping = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        firstName: true;
        lastName: true;
        phone: true;
      };
    };
    ShippingMethod: {
      select: {
        id: true;
        name: true;
        cost: true;
      };
    };
  };
}>;

export default function OrdersList({
  orders,
}: {
  orders: OrderWithUserAndShipping[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const filteredOrders = orders.filter((order) => {
    const fullName = `${order.user.firstName ?? ""} ${
      order.user.lastName ?? ""
    }`.trim();
    const matchesSearch =
      order.id.includes(search) ||
      order.trackingCode?.includes(search) ||
      fullName.includes(search) ||
      order.user.phone.includes(search);

    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesPayment = paymentFilter
      ? order.paymentStatus === paymentFilter
      : true;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-stretch sm:items-center">
        <Input
          placeholder="جستجو بر اساس شماره سفارش، نام یا شماره تماس..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="وضعیت سفارش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">در انتظار</SelectItem>
            <SelectItem value="PAID">پرداخت شده</SelectItem>
            <SelectItem value="SHIPPED">ارسال شده</SelectItem>
            <SelectItem value="COMPLETED">تکمیل شده</SelectItem>
            <SelectItem value="CANCELED">لغو شده</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="وضعیت پرداخت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">در انتظار پرداخت</SelectItem>
            <SelectItem value="PAID">پرداخت موفق</SelectItem>
            <SelectItem value="FAILED">پرداخت ناموفق</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setStatusFilter("");
            setPaymentFilter("");
          }}
          className="w-full sm:w-auto"
        >
          پاک کردن فیلترها
        </Button>
      </div>

      {/* Orders Table (desktop) */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>شماره سفارش</TableHead>
              <TableHead>نام مشتری</TableHead>
              <TableHead>شماره تماس</TableHead>
              <TableHead>تاریخ ثبت</TableHead>
              <TableHead>وضعیت سفارش</TableHead>
              <TableHead>وضعیت پرداخت</TableHead>
              <TableHead>مبلغ کل</TableHead>
              <TableHead>تخفیف</TableHead>
              <TableHead>مبلغ نهایی</TableHead>
              <TableHead>روش ارسال</TableHead>
              <TableHead>روش پرداخت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const fullName = `${order.user.firstName ?? ""} ${
                order.user.lastName ?? ""
              }`.trim();
              return (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    {order.fullName || fullName || "بدون نام"}{" "}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {order.user.phone}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  <TableCell>
                    {order.totalPrice.toLocaleString()} تومان
                  </TableCell>
                  <TableCell>{order.discount.toLocaleString()} تومان</TableCell>
                  <TableCell>
                    {order.finalPrice.toLocaleString()} تومان
                  </TableCell>
                  <TableCell>{order.ShippingMethod?.name ?? "-"}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                </TableRow>
              );
            })}

            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-muted-foreground py-6"
                >
                  سفارشی یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Orders Cards (mobile) */}
      <div className="grid gap-4 md:hidden">
        {filteredOrders.map((order) => {
          const fullName = `${order.user.firstName ?? ""} ${
            order.user.lastName ?? ""
          }`.trim();
          return (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">سفارش #{order.id}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <p>👤 {fullName || "بدون نام"}</p>
              <p>📞 {order.user.phone}</p>
              <p>📦 وضعیت: {order.status}</p>
              <p>💳 پرداخت: {order.paymentStatus}</p>
              <p>💰 مبلغ نهایی: {order.finalPrice.toLocaleString()} تومان</p>
              <p>🚚 ارسال: {order.ShippingMethod?.name ?? "-"}</p>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <p className="text-center text-muted-foreground">سفارشی یافت نشد</p>
        )}
      </div>
    </div>
  );
}
