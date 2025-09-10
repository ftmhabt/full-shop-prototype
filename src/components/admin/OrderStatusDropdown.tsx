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
import { useState, useTransition } from "react";

interface OrderStatusDialogProps {
  order: any;
}

export default function OrderStatusDialog({ order }: OrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const statusOptions = [
    { value: "PENDING", label: "در انتظار پرداخت" },
    { value: "PAID", label: "پرداخت شده" },
    { value: "SHIPPED", label: "ارسال شده" },
    { value: "COMPLETED", label: "تحویل داده شده" },
    { value: "CANCELED", label: "لغو شده" },
  ];

  const handleSelectChange = (newStatus: string) => {
    if (newStatus === selectedStatus) return;
    setPendingStatus(newStatus);
    setTrackingCode(""); // فقط SHIPPED نیاز داره
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingStatus) return;

    startTransition(async () => {
      await changeOrderStatus(
        order.id,
        pendingStatus as any,
        trackingCode || undefined
      );
      setSelectedStatus(pendingStatus);
      setPendingStatus(null);
      setTrackingCode("");
      setIsDialogOpen(false);
    });
  };

  const handleCancel = () => {
    setPendingStatus(null);
    setTrackingCode("");
    setIsDialogOpen(false);
  };

  return (
    <>
      <Select
        value={selectedStatus}
        onValueChange={handleSelectChange}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder="وضعیت سفارش" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md text-right">
          <DialogHeader>
            <DialogTitle>تغییر وضعیت سفارش</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              آیا مطمئن هستید می‌خواهید وضعیت سفارش را به "{pendingStatus}"
              تغییر دهید؟
            </p>
          </DialogHeader>

          {pendingStatus === "SHIPPED" && (
            <div className="mt-2">
              <Input
                placeholder="کد رهگیری پستی"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
            </div>
          )}

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
