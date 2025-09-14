"use client";

import PaymentSuccessClient from "@/components/payment/PaymentSuccessClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={<div className="text-center p-6">در حال بارگذاری...</div>}
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
