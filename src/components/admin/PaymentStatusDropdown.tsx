"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";

import { changePaymentStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentStatusProps {
  order: any;
}

export default function PaymentStatusDropdown({ order }: PaymentStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.paymentStatus);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const paymentOptions = [
    { value: "PENDING", label: "در انتظار پرداخت" },
    { value: "PAID", label: "پرداخت شده" },
    { value: "FAILED", label: "ناموفق" },
  ];

  const handleSelectChange = (newStatus: string) => {
    if (newStatus === selectedStatus) return;
    setPendingStatus(newStatus);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingStatus) return;

    startTransition(async () => {
      await changePaymentStatus(order.id, pendingStatus as any);
      setSelectedStatus(pendingStatus);
      setPendingStatus(null);
      setIsDialogOpen(false);
    });
  };

  const handleCancel = () => {
    setPendingStatus(null);
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
          <SelectValue placeholder="وضعیت پرداخت" />
        </SelectTrigger>
        <SelectContent>
          {paymentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md text-right">
          <DialogHeader>
            <DialogTitle>تغییر وضعیت پرداخت</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              آیا مطمئن هستید می‌خواهید وضعیت پرداخت را به "{pendingStatus}"
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

      {/* جزئیات تراکنش */}
      {order.paymentMethod && (
        <div className="mt-2 text-sm text-muted-foreground">
          <p>
            <strong>روش پرداخت:</strong> {order.paymentMethod}
          </p>
          {order.paidAt && (
            <p>
              <strong>زمان پرداخت:</strong>{" "}
              {new Date(order.paidAt).toLocaleString("fa-IR")}
            </p>
          )}
        </div>
      )}
    </>
  );
}
