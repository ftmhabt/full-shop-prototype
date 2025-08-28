"use client";

import { useState } from "react";
import AddressForm from "../AddressForm";
import { AddressStepProps } from "../types";

export default function AddressStep({
  addresses,
  onNext,
  selectedAddressId,
  setSelectedAddressId,
}: AddressStepProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">آدرس‌های شما</h2>

      {addresses.map((addr) => (
        <div
          key={addr.id}
          onClick={() => setSelectedAddressId(addr.id)}
          className={`border p-3 rounded cursor-pointer ${
            selectedAddressId === addr.id ? "border-primary bg-primary/10" : ""
          }`}
        >
          <p>{addr.fullName}</p>
          <p>
            {addr.province} - {addr.city}
          </p>
          <p>{addr.address}</p>
        </div>
      ))}

      {showForm ? (
        <AddressForm onClose={() => setShowForm(false)} isVisible />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 border rounded"
        >
          افزودن آدرس جدید
        </button>
      )}

      <button
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
        onClick={onNext}
        disabled={!selectedAddressId}
      >
        مرحله بعد
      </button>
    </div>
  );
}
