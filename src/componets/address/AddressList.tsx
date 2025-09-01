"use client";

import { Address } from "@/types";
import { Hash, Home, MapIcon, MapPin, Phone, User } from "lucide-react";
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
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <MapIcon className="w-6 h-6" /> آدرس‌های من
        </h1>

        <button
          className="bg-primary text-white px-4 py-2 rounded-lg"
          onClick={() => setShowForm(!showForm)}
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
        <div className="grid gap-4 md:grid-cols-2 auto-rows-auto">
          {addresses.map((addr) => (
            <div key={addr.id} className="border p-4 rounded-2xl shadow h-fit ">
              {editingId === addr.id ? (
                <EditAddressForm
                  address={addr}
                  onClose={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{addr.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{addr.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>
                      {addr.province}, {addr.city}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span>{addr.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span>{addr.postalCode || "ثبت نشده"}</span>
                  </div>

                  <button
                    onClick={() => setEditingId(addr.id)}
                    className="mt-2 mr-auto block text-primary underline"
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
