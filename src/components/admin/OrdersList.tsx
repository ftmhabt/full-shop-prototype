"use client";

import { changeOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import Link from "next/link";
import { useState, useTransition } from "react";

// --- نوع سفارش با اطلاعات کاربر و روش ارسال ---
type OrderWithUserAndShipping = Prisma.OrderGetPayload<{
  include: {
    user: { select: { firstName: true; lastName: true; phone: true } };
    ShippingMethod: { select: { id: true; name: true; cost: true } };
  };
}>;

// --- کامپوننت ConfirmDropdown برای تغییر وضعیت سفارش ---
interface ConfirmDropdownProps {
  orderId: string;
  currentStatus: string;
  onUpdated: (newStatus: string) => void;
}

function ConfirmDropdown({
  orderId,
  currentStatus,
  onUpdated,
}: ConfirmDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const statusOptions = [
    { value: "PENDING", label: "در انتظار" },
    { value: "PAID", label: "پرداخت شده" },
    { value: "SHIPPED", label: "ارسال شده" },
    { value: "COMPLETED", label: "تکمیل شده" },
    { value: "CANCELED", label: "لغو شده" },
  ];

  const handleChange = (newStatus: string) => {
    if (newStatus === selectedStatus) return;
    setPendingStatus(newStatus);
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingStatus) return;
    startTransition(async () => {
      await changeOrderStatus(orderId, pendingStatus as any);
      setSelectedStatus(pendingStatus);
      onUpdated(pendingStatus);
      setPendingStatus(null);
      setOpen(false);
    });
  };

  const handleCancel = () => {
    setPendingStatus(null);
    setOpen(false);
  };

  return (
    <>
      <Select
        value={selectedStatus}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="وضعیت سفارش" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md text-right">
          <DialogHeader>
            <DialogTitle>تغییر وضعیت سفارش</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              آیا مطمئن هستید می‌خواهید وضعیت سفارش را به "{pendingStatus}"
              تغییر دهید؟
            </p>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={handleCancel}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isPending}
            >
              تایید
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- کامپوننت اصلی OrdersList ---
export default function OrdersList({
  orders,
}: {
  orders: OrderWithUserAndShipping[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("ALL"); // روزانه / هفتگی / ماهانه / همه

  // --- فیلترها ---
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

    // فیلتر بازه زمانی
    let matchesTime = true;
    const now = new Date();
    const created = new Date(order.createdAt);
    if (timeFilter === "DAILY")
      matchesTime = created.toDateString() === now.toDateString();
    if (timeFilter === "WEEKLY") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      matchesTime = created >= weekAgo;
    }
    if (timeFilter === "MONTHLY") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      matchesTime = created >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesTime;
  });

  // --- پرفروش‌ترین محصولات ---
  const productCountMap: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    // فرض می‌کنیم هر order شامل items با productId و quantity است
    (o as any).items?.forEach((item: any) => {
      productCountMap[item.productId] =
        (productCountMap[item.productId] || 0) + item.quantity;
    });
  });

  return (
    <div className="space-y-6">
      {/* فیلترها و جستجو */}
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
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">همه</SelectItem>
            <SelectItem value="DAILY">روزانه</SelectItem>
            <SelectItem value="WEEKLY">هفتگی</SelectItem>
            <SelectItem value="MONTHLY">ماهانه</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setStatusFilter("");
            setPaymentFilter("");
            setTimeFilter("ALL");
          }}
          className="w-full sm:w-auto"
        >
          پاک کردن فیلترها
        </Button>
      </div>

      {/* جدول دسکتاپ با scroll افقی */}
      <div className="overflow-x-auto w-full border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">شماره سفارش</TableHead>
              <TableHead className="text-right">نام مشتری</TableHead>
              <TableHead className="text-right">شماره تماس</TableHead>
              <TableHead className="text-right">تاریخ ثبت</TableHead>
              <TableHead className="text-right">وضعیت سفارش</TableHead>
              <TableHead className="text-right">وضعیت پرداخت</TableHead>
              <TableHead className="text-right">مبلغ کل</TableHead>
              <TableHead className="text-right">تخفیف</TableHead>
              <TableHead className="text-right">مبلغ نهایی</TableHead>
              <TableHead className="text-right">روش ارسال</TableHead>
              <TableHead className="text-right">روش پرداخت</TableHead>
              <TableHead className="text-right">اکشن‌ها</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const fullName = `${order.user.firstName ?? ""} ${
                order.user.lastName ?? ""
              }`.trim();
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.fullName || fullName || "بدون نام"}
                  </TableCell>
                  <TableCell>{order.user.phone}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell>
                    <ConfirmDropdown
                      orderId={order.id}
                      currentStatus={order.status}
                      onUpdated={() => {}}
                    />
                  </TableCell>
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
                  <TableCell className="space-x-2">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="default">جزئیات</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `/admin/orders/${order.id}/invoice.pdf`,
                          "_blank"
                        )
                      }
                    >
                      دانلود فاکتور
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* کارت موبایل */}
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
              <div className="flex gap-2">
                <ConfirmDropdown
                  orderId={order.id}
                  currentStatus={order.status}
                  onUpdated={() => {}}
                />
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="default" size="sm">
                    جزئیات
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `/admin/orders/${order.id}/invoice.pdf`,
                      "_blank"
                    )
                  }
                >
                  فاکتور
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
