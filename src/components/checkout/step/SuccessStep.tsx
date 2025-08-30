"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessStep() {
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get("trackingCode");
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        سفارش با موفقیت ثبت شد 🎉
      </h2>
      <p>کد رهگیری شما: {trackingCode}</p>
    </div>
  );
}
