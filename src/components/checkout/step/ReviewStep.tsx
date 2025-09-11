"use client";

import { createOrderAndStartPayment } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartServer } from "@/hooks/useCartServer";
import { formatPrice } from "@/lib/format";
import { Address } from "@/types";
import { ShippingMethod } from "@prisma/client";
import {
  Hash,
  Home,
  Loader,
  MapPin,
  Phone,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";

export default function ReviewStep({
  selectedAddress,
  shippingMethod,
  discount,
  onBack,
}: {
  selectedAddress: Address | null;
  shippingMethod: ShippingMethod | null;
  discount: number;
  onBack: () => void;
}) {
  const { items } = useCartServer();
  const [loading, setLoading] = useState(false);
  // ✅ Calculate totals
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = shippingMethod?.cost || 0;
  const totalToPay = itemsTotal + shippingCost - discount;

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const url = await createOrderAndStartPayment(
        items,
        {
          fullName: selectedAddress?.fullName || "",
          phone: selectedAddress?.phone || "",
          province: selectedAddress?.province || "",
          city: selectedAddress?.city || "",
          address: selectedAddress?.address || "",
          postalCode: selectedAddress?.postalCode || "",
        },
        discount,
        shippingMethod?.id || ""
      );

      window.location.href = url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">مرور سفارش</h2>

      {/* آدرس */}
      <Card className="bg-gray-50 border">
        <CardHeader>
          <CardTitle className="text-gray-700 text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            آدرس انتخابی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-800">
          {selectedAddress ? (
            <>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{selectedAddress.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{selectedAddress.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>
                  {selectedAddress.province}, {selectedAddress.city}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{selectedAddress.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span>{selectedAddress.postalCode || "ثبت نشده"}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500">هیچ آدرسی انتخاب نشده است.</p>
          )}
        </CardContent>
      </Card>

      {/* روش ارسال */}
      <Card className="bg-gray-50 border">
        <CardHeader>
          <CardTitle className="text-gray-700 text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            روش ارسال
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-800">
          {shippingMethod ? (
            <div className="flex justify-between border-b pb-1">
              <span>{shippingMethod.name}</span>
              <span>{formatPrice(shippingMethod.cost)} تومان</span>
            </div>
          ) : (
            <p className="text-gray-500">روش ارسال انتخاب نشده است.</p>
          )}
        </CardContent>
      </Card>

      {/* آیتم‌های سبد خرید */}
      <Card className="bg-gray-50 border">
        <CardHeader>
          <CardTitle className="text-gray-700 text-base flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-gray-500" />
            سبد خرید
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-800 space-y-2">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-1">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)} تومان</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">سبد خرید خالی است.</p>
          )}
        </CardContent>
      </Card>
      {/* آیتم‌های سبد خرید */}
      <Card className="bg-gray-50 border">
        <CardContent className="text-sm text-gray-800 space-y-2">
          {/* ✅ Total to pay */}
          <div className="flex justify-between font-bold ">
            <span>جمع کل قابل پرداخت</span>
            <span>{formatPrice(totalToPay)} تومان</span>
          </div>
        </CardContent>
      </Card>
      {/* دکمه‌ها */}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          بازگشت
        </Button>
        <Button
          className="flex-1 flex items-center justify-center"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : "پرداخت"}
        </Button>
      </div>
    </div>
  );
}
