"use client";

import { Button } from "@/components/ui/button";
import { ShippingStepProps } from "../types";

const methods = [
  { id: "STANDARD", name: "ارسال معمولی", cost: 20000 },
  { id: "EXPRESS", name: "ارسال فوری", cost: 50000 },
];

export default function ShippingStep({
  shippingMethod,
  setShippingMethod,
  onNext,
  onBack,
}: ShippingStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">روش ارسال</h2>

      {methods.map((m) => (
        <div
          key={m.id}
          onClick={() => setShippingMethod(m.id)}
          className={`border p-3 rounded cursor-pointer flex justify-between items-center ${
            shippingMethod === m.id ? "border-primary bg-primary/10" : ""
          }`}
        >
          <span>{m.name}</span>
          <span>{new Intl.NumberFormat("fa-IR").format(m.cost)} تومان</span>
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          بازگشت
        </Button>
        <Button
          className="flex-1"
          onClick={onNext}
          disabled={shippingMethod === ""}
        >
          ادامه
        </Button>
      </div>
    </div>
  );
}
