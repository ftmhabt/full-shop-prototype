"use client";

import { Button } from "@/components/ui/button";
import { CartStepProps } from "../types";

export default function CartStep({ cart, onNext }: CartStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">سبد خرید</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p>{item.name}</p>
              <p className="text-sm text-muted-foreground">
                تعداد: {item.quantity}
              </p>
            </div>
            <p>{item.price * item.quantity} تومان</p>
          </div>
        ))}
      </div>
      <Button className="mt-6" onClick={onNext}>
        ادامه
      </Button>
    </div>
  );
}
