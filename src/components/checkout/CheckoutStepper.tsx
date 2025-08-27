"use client";

import { Button } from "@/components/ui/button";
import AddressForm from "@/componets/address/AddressForm";
import { useCart } from "@/store/useCart";
import { useState } from "react";

interface Address {
  id: string;
  userId: string;
  title: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}
interface CheckoutStepperProps {
  addresses: Address[];
}

export default function CheckoutStepper({
  addresses: initialAddresses,
}: CheckoutStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses[0]?.id || null
  );
  const [showAddressForm, setShowAddressForm] = useState(false);

  const cart = useCart();

  // --- نکات UX ---
  const isAddressStep = currentStep === 0;
  const isCartStep = currentStep === 1;
  const isReviewStep = currentStep === 2;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleAddAddress = (address: Address) => {
    setAddresses((prev) => [...prev, address]);
    setSelectedAddressId(address.id);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    try {
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          cart: cart.items,
          shippingAddress: selectedAddress,
        }),
      });
      if (!res.ok) throw new Error("خطا در ثبت سفارش");
      cart.clearCart();
      alert("سفارش شما با موفقیت ثبت شد 🎉");
      setCurrentStep(0);
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت سفارش");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* --- Step Indicator --- */}
      <div className="flex justify-between mb-6">
        {["آدرس", "سبد خرید", "تایید نهایی"].map((label, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                currentStep === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i + 1}
            </div>
            <p className="mt-2 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* --- Step Content --- */}
      <div>
        {isAddressStep && (
          <div>
            <h2 className="text-lg font-semibold mb-4">انتخاب آدرس</h2>

            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className="block border p-3 rounded cursor-pointer flex justify-between items-center"
                  >
                    <span>
                      {a.title} - {a.fullName}, {a.city} ({a.phone})
                    </span>
                    <input
                      type="radio"
                      name="address"
                      value={a.id}
                      checked={selectedAddressId === a.id}
                      onChange={() => setSelectedAddressId(a.id)}
                    />
                  </label>
                ))}
              </div>
            ) : (
              <p>هیچ آدرسی ثبت نشده است.</p>
            )}

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowAddressForm((v) => !v)}
            >
              {showAddressForm ? "انصراف افزودن آدرس" : "افزودن آدرس جدید"}
            </Button>

            {showAddressForm && (
              <AddressForm
                onClose={() => setShowAddressForm(false)}
                isVisible={showAddressForm}
              />
            )}
          </div>
        )}

        {isCartStep && (
          <div>
            <h2 className="text-lg font-semibold mb-4">سبد خرید</h2>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => cart.decreaseQty(item.id)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button onClick={() => cart.increaseQty(item.id)}>+</Button>
                  </div>
                  <span>{item.price * item.quantity} تومان</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-right font-semibold">
              جمع کل: {cart.totalPrice} تومان
            </p>
          </div>
        )}

        {isReviewStep && (
          <div>
            <h2 className="text-lg font-semibold mb-4">تایید و ثبت سفارش</h2>

            <p className="mb-2">آدرس انتخاب شده:</p>
            <div className="border p-3 rounded mb-4">
              {addresses.find((a) => a.id === selectedAddressId)?.fullName},{" "}
              {addresses.find((a) => a.id === selectedAddressId)?.address},{" "}
              {addresses.find((a) => a.id === selectedAddressId)?.city},{" "}
              {addresses.find((a) => a.id === selectedAddressId)?.province}
            </div>

            <p className="mb-2">محصولات سبد خرید:</p>
            <div className="space-y-2 border p-3 rounded">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} × {item.price} تومان
                  </span>
                  <span>{item.quantity * item.price} تومان</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-right font-semibold">
              جمع کل: {cart.totalPrice} تومان
            </p>
          </div>
        )}
      </div>

      {/* --- Step Navigation --- */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          مرحله قبل
        </Button>

        {currentStep < 2 ? (
          <Button
            onClick={nextStep}
            disabled={isAddressStep && !selectedAddressId}
          >
            مرحله بعد
          </Button>
        ) : (
          <Button onClick={handlePlaceOrder} disabled={!selectedAddressId}>
            ثبت سفارش
          </Button>
        )}
      </div>
    </div>
  );
}
