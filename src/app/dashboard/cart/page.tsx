"use client";

import { Button } from "@/components/ui/button";
import { useCartServer } from "@/hooks/useCartServer";
import Image from "next/image";

export default function CartPage() {
  const { items, remove, totalPrice, decrease, increase, clear, isPending } =
    useCartServer();

  if (items.length === 0) return <p>سبد خرید خالی است</p>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">سبد خرید</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-2 sm:grid-cols-3 border p-3 rounded"
          >
            <div className="flex items-center gap-3 col-span-1 sm:col-span-2">
              <Image
                src={item.image || ""}
                alt={item.name}
                width={50}
                height={50}
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>
                  {item.quantity} ×{" "}
                  {new Intl.NumberFormat("fa-IR").format(item.price)} تومان
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full justify-between">
              <Button
                size="icon"
                variant="outline"
                onClick={() => decrease(item.id)}
                disabled={isPending}
              >
                -
              </Button>
              <span className="w-6 text-center">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => increase(item.id)}
                disabled={isPending}
              >
                +
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => remove(item.id)}
                disabled={isPending}
              >
                حذف
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <p className="text-lg font-bold">
          مجموع: {new Intl.NumberFormat("fa-IR").format(totalPrice)} تومان
        </p>
        <Button onClick={clear} disabled={isPending}>
          تسویه حساب
        </Button>
      </div>
    </div>
  );
}
