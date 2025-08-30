"use client";

import { Button } from "@/components/ui/button";
import { useCartServer } from "@/hooks/useCartServer";
import { Address } from "@/types";

export default function ReviewStep({
  selectedAddress,
  shippingMethod,
  onBack,
  onNext,
}: {
  selectedAddress: Address | null;
  shippingMethod: string | null;
  onBack: () => void;
  onNext: () => void;
}) {
  const { items } = useCartServer();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">مرور سفارش</h2>

      {/* آدرس */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">آدرس انتخابی</h3>
        {selectedAddress ? (
          <p className="text-sm leading-relaxed">
            {selectedAddress.fullName} - {selectedAddress.phone} <br />
            {selectedAddress.province}, {selectedAddress.city} <br />
            {selectedAddress.address} <br />
            کد پستی: {selectedAddress.postalCode || "ثبت نشده"}
          </p>
        ) : (
          <p className="text-sm text-gray-500">هیچ آدرسی انتخاب نشده است.</p>
        )}
      </div>

      {/* روش ارسال */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">روش ارسال</h3>
        <p className="text-sm">
          {shippingMethod ? shippingMethod : "روش ارسال انتخاب نشده است"}
        </p>
      </div>

      {/* آیتم‌های سبد خرید */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">سبد خرید</h3>
        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-sm border-b pb-1"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.price * item.quantity} تومان</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">سبد خرید خالی است.</p>
        )}
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          بازگشت
        </Button>
        <Button className="flex-1" onClick={onNext}>
          ادامه
        </Button>
      </div>
    </div>
  );
}
