"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import Image from "next/image";

export default function CartPanel({ onClose }: { onClose?: () => void }) {
  const { items, totalPrice, increaseQty, decreaseQty, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return <p className="text-center py-8">سبد خرید خالی است</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border rounded-lg p-2"
          >
            <div className="flex items-center gap-3">
              <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={56}
                className="rounded-md"
              />
              <div className="leading-6">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat("fa-IR").format(item.price)} تومان
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => decreaseQty(item.id)}
              >
                -
              </Button>
              <span className="w-6 text-center">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => increaseQty(item.id)}
              >
                +
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeItem(item.id)}
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t mt-3 pt-3 space-y-3">
        <p className="font-bold text-lg">
          مجموع: {new Intl.NumberFormat("fa-IR").format(totalPrice)} تومان
        </p>
        <div className="flex gap-2">
          <Button className="flex-1">تسویه حساب</Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              clearCart();
              onClose?.();
            }}
          >
            خالی کردن سبد
          </Button>
        </div>
      </div>
    </div>
  );
}
