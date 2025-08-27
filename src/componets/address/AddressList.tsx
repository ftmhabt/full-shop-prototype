"use client";

import { useUser } from "@/store/useUser";
import { Address } from "@/types";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";

interface AddressesPageProps {
  addresses: Address[];
  serverUserId: string | null;
}

export default function AddressList({
  addresses,
  serverUserId,
}: AddressesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const setUserId = useUser((state) => state.setUserId);

  useEffect(() => {
    setUserId(serverUserId || "");
  }, [serverUserId, setUserId]);
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">آدرس‌های من</h1>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          افزودن آدرس
        </button>
      </div>

      {showForm && <AddressForm onSuccess={() => setShowForm(false)} />}
      {addresses.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">
          هیچ آدرسی ثبت نشده است.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{addr.title}</h2>
              <p>
                {addr.fullName} - {addr.phone}
              </p>
              <p>
                {addr.province}, {addr.city}
              </p>
              <p>{addr.address}</p>
              {addr.postalCode && <p>کد پستی: {addr.postalCode}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
