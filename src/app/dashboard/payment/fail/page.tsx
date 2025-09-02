"use client";

import PaymentFailClient from "@/components/payment/PaymentFailClient";
import { Suspense } from "react";

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<p>در حال بارگذاری...</p>}>
      <PaymentFailClient />
    </Suspense>
  );
}
