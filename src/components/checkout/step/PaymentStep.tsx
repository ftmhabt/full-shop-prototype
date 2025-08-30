"use client";

import { createOrderAndStartPayment } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import { PaymentStepProps } from "../types";

export default function PaymentStep({
  orderId,
  onSuccess,
  onBack,
}: PaymentStepProps) {
  // PaymentStep.tsx
  const handlePayment = async () => {
    await createOrderAndStartPayment(orderId); // server action که کاربر رو به درگاه هدایت می‌کنه
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">پرداخت</h2>
      <p>برای ادامه روی دکمه پرداخت کلیک کنید.</p>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          بازگشت
        </Button>
        <Button className="flex-1" onClick={handlePayment}>
          پرداخت
        </Button>
      </div>
    </div>
  );
}
