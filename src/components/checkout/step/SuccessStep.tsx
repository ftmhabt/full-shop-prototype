"use client";

interface Props {
  orderId: string;
}

export default function SuccessStep({ orderId }: Props) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        سفارش با موفقیت ثبت شد 🎉
      </h2>
      <p>کد سفارش شما: {orderId}</p>
    </div>
  );
}
