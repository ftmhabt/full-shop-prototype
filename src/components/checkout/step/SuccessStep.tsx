"use client";

import { SuccessStepProps } from "../types";

export default function SuccessStep({ trackingCode }: SuccessStepProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        سفارش با موفقیت ثبت شد 🎉
      </h2>
      <p>کد رهگیری شما: {trackingCode}</p>
    </div>
  );
}
