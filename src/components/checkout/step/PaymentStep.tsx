"use client";

import { Button } from "@/components/ui/button";
import { PaymentStepProps } from "../types";

export default function PaymentStep({ orderId, onSuccess }: PaymentStepProps) {
  const handlePayment = async () => {
    // ریدایرکت به درگاه واقعی
    // window.location.href = `/api/payment/start?orderId=${orderId}`;

    // تست: بعد از ۲ ثانیه موفقیت
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">پرداخت</h2>
      <p className="mb-4">برای ادامه پرداخت روی دکمه زیر کلیک کنید.</p>
      <Button onClick={handlePayment}>پرداخت</Button>
    </div>
  );
}
