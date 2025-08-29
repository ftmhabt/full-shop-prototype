"use client";

import { Address } from "@/types";
import { useState } from "react";
import AddressForm from "./AddressForm";
import EditAddressForm from "./EditAddressForm";

interface AddressesPageProps {
  addresses: Address[];
}

export default function AddressList({ addresses }: AddressesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">آدرس‌های من</h1>

        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          افزودن آدرس
        </button>
      </div>

      {showForm && (
        <AddressForm onClose={() => setShowForm(false)} isVisible={showForm} />
      )}

      {addresses.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">
          هیچ آدرسی ثبت نشده است.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 mt-4 auto-rows-auto">
          {addresses.map((addr) => (
            <div key={addr.id} className="border p-4 rounded shadow h-fit">
              {editingId === addr.id ? (
                <EditAddressForm
                  address={addr}
                  onClose={() => setEditingId(null)}
                />
              ) : (
                <>
                  <h2 className="font-semibold">{addr.title}</h2>
                  <p>
                    {addr.fullName} - {addr.phone}
                  </p>
                  <p>
                    {addr.province}, {addr.city}
                  </p>
                  <p>{addr.address}</p>
                  {addr.postalCode && <p>کد پستی: {addr.postalCode}</p>}

                  <button
                    onClick={() => setEditingId(addr.id)}
                    className="mt-2 text-primary underline"
                  >
                    ویرایش
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
