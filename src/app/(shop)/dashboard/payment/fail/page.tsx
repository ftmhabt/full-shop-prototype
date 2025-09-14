"use client";

import PaymentFailClient from "@/components/payment/PaymentFailClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={<div className="text-center p-6">در حال بارگذاری...</div>}
    >
      <PaymentFailClient />
    </Suspense>
  );
}
