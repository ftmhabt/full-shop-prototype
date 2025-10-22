"use client";

import { Address } from "@/types";
import { ShippingMethod } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import AddressStep from "./step/AddressStep";
import ReviewStep from "./step/ReviewStep";
import ShippingStep from "./step/ShippingStep";

interface Props {
  addresses: Address[];
}

export default function CheckoutStepper({ addresses }: Props) {
  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<Address | null>(
    null
  );
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(
    null
  );
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const steps = [
    {
      title: "آدرس",
      component: (
        <AddressStep
          addresses={addresses}
          selectedAddress={selectedAddressId}
          setSelectedAddress={setSelectedAddressId}
          onNext={goNext}
        />
      ),
    },
    {
      title: "روش ارسال",
      component: (
        <ShippingStep
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          onNext={goNext}
          onBack={goBack}
        />
      ),
    },
    {
      title: "پرداخت",
      component: (
        <ReviewStep
          shippingMethod={shippingMethod}
          selectedAddress={selectedAddressId}
          onBack={goBack}
        />
      ),
    },
  ];

  useEffect(() => {
    if (stepRefs.current[step]) {
      stepRefs.current[step]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [step]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* indicator */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {steps.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className={`px-4 py-2 rounded text-nowrap flex-shrink-0 select-none ${
              i === step ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* content */}
      <div className="flex-1 border rounded p-4 min-h-2/3">
        {steps[step].component}
      </div>
    </div>
  );
}
