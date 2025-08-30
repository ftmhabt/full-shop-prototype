"use client";

import { createOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { PaymentStepProps } from "../types";

export default function PaymentStep({
  orderId,
  onSuccess,
  onBack,
}: PaymentStepProps) {
  const handlePayment = async () => {
    // شبیه‌سازی پرداخت
    const trackingCode = "TRK-" + Date.now();

    // ثبت سفارش در دیتابیس بعد از پرداخت موفق
    await createOrder("USER_ID_PLACEHOLDER", [], {
      fullName: "Test",
      phone: "09123456789",
      province: "تهران",
      city: "تهران",
      address: "خیابان تست",
      postalCode: "1234567890",
    });

    setTimeout(() => onSuccess(trackingCode), 2000);
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
