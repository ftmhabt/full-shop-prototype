"use client";

import { Button } from "@/components/ui/button";
import { useCartServer } from "@/hooks/useCartServer";
import Image from "next/image";

export default function CartPanel({ onClose }: { onClose?: () => void }) {
  const { items, totalPrice, increase, decrease, remove, clear, isPending } =
    useCartServer();

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
                src={item.image || "/fallback.png"}
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
          </div>
        ))}
      </div>

      <div className="border-t mt-3 pt-3 space-y-3">
        <p className="font-bold text-lg">
          مجموع: {new Intl.NumberFormat("fa-IR").format(totalPrice)} تومان
        </p>
        <div className="flex gap-2">
          <Button className="flex-1" disabled={isPending}>
            تسویه حساب
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              clear();
              onClose?.();
            }}
            disabled={isPending}
          >
            خالی کردن سبد
          </Button>
        </div>
      </div>
    </div>
  );
}
