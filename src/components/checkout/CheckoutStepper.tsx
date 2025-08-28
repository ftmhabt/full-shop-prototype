// components/checkout/CheckoutStepper.tsx
"use client";

import { useCartServer } from "@/hooks/useCartServer";
import { Address } from "@prisma/client";
import { useState } from "react";
import AddressStep from "./step/AddressStep";
import CartStep from "./step/CartStep";
import PaymentStep from "./step/PaymentStep";
import ReviewStep from "./step/ReviewStep";
import SuccessStep from "./step/SuccessStep";

interface Props {
  addresses: Address[];
}

export default function CheckoutStepper({ addresses }: Props) {
  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [orderId, setOrderId] = useState<string | null>(null);

  const { items } = useCartServer();

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const steps = [
    {
      title: "آدرس",
      component: (
        <AddressStep
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          onNext={goNext}
        />
      ),
    },
    {
      title: "سبد خرید",
      component: <CartStep cart={items} onNext={goNext} />,
    },
    {
      title: "مرور سفارش",
      component: <ReviewStep onNext={goNext} onBack={goBack} />,
    },
    {
      title: "پرداخت",
      component: (
        <PaymentStep
          orderId={orderId ?? "temp-123"}
          onSuccess={() => {
            setOrderId("ORD-" + Date.now());
            goNext();
          }}
        />
      ),
    },
    {
      title: "موفقیت",
      component: <SuccessStep orderId={orderId ?? "ORD-000"} />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* indicator */}
      <div className="flex md:flex-col gap-2">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded cursor-pointer ${
              i === step ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* content */}
      <div className="flex-1 border rounded p-4">{steps[step].component}</div>
    </div>
  );
}
