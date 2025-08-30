"use client";

import { Address } from "@/types";

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
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">انتخاب آدرس</h2>

      {addresses.length > 0 ? (
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
      ) : (
        <p className="text-sm text-gray-500">
          هیچ آدرسی ثبت نشده است. لطفاً یک آدرس جدید اضافه کنید.
        </p>
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
