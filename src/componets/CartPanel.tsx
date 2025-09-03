"use client";

import { Button } from "@/components/ui/button";
import { useCartServer } from "@/hooks/useCartServer";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QuantitySelector from "./product details/QuantitySelector";

export default function CartPanel({ onClose }: { onClose?: () => void }) {
  const { items, totalPrice, remove, clear, isPending } = useCartServer();
  const router = useRouter();
  if (items.length === 0) {
    return <p className="text-center py-8">سبد خرید خالی است</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row gap-3 items-center justify-between border rounded-lg p-2"
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
              <QuantitySelector product={item} quantity={item.quantity} />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => remove(item.id)}
                disabled={isPending}
                className="w-10 h-10 rounded-lg"
              >
                <Trash className="block" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 border-t mt-3 pt-3 space-y-3 bg-white">
        <p className="font-bold text-lg">
          مجموع: {new Intl.NumberFormat("fa-IR").format(totalPrice)} تومان
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1"
            disabled={isPending}
            onClick={() => {
              onClose?.();
              router.push("/dashboard/cart/checkout");
            }}
          >
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
