"use client";

import { Button } from "@/components/ui/button";
import { Address } from "@/types";
import { useState } from "react";
import AddressForm from "../AddressForm";

export default function AddressStep({
  addresses,
  selectedAddress,
  setSelectedAddress,
  onNext,
}: {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
  onNext: () => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">انتخاب آدرس</h2>
      {/* Toggle add new address form */}
      {!showForm ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          افزودن آدرس جدید
        </Button>
      ) : (
        <AddressForm onClose={() => setShowForm(false)} isVisible={true} />
      )}
      {addresses.length > 0 && !showForm && (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedAddress?.id === address.id
                  ? "border-primary bg-primary-foreground"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setSelectedAddress(address)}
            >
              <p className="font-semibold">{address.fullName}</p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm mt-1 leading-relaxed">
                {address.province}, {address.city}, {address.address}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                کد پستی: {address.postalCode || "ثبت نشده"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedAddress}
          className={`px-4 py-2 rounded-lg text-white w-1/2 ${
            selectedAddress ? "bg-primary" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          ادامه
        </button>
      </div>
    </div>
  );
}
