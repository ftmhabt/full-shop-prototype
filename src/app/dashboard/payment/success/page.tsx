import PaymentSuccessClient from "@/components/payment/PaymentSuccessClient";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p>در حال بارگذاری...</p>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
