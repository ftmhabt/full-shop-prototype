"use client";

import { useCartServer } from "@/hooks/useCartServer";
import Image from "next/image";
import { ReviewStepProps } from "../types";

export default function ReviewStep({ onNext, onBack }: ReviewStepProps) {
  const { items, totalPrice } = useCartServer();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">مرور سبد خرید</h2>

      {items.length === 0 ? (
        <p>سبد خرید خالی است</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.image || "/fallback.png"}
                  width={50}
                  height={50}
                  alt={item.name}
                />
                <span>{item.name}</span>
              </div>
              <span>
                {item.quantity} ×{" "}
                {new Intl.NumberFormat("fa-IR").format(item.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="font-bold text-lg mt-4">
        مجموع: {new Intl.NumberFormat("fa-IR").format(totalPrice)} تومان
      </p>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 border rounded"
          onClick={onBack}
        >
          مرحله قبل
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={onNext}
          disabled={items.length === 0}
        >
          مرحله بعد
        </button>
      </div>
    </div>
  );
}
