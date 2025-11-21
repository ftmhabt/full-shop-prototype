"use client";

import { applyDiscount } from "@/app/actions/admin/discount";
import { createOrderAndStartPayment } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { clear } from "@/store/cartSlice";
import { selectCartItems } from "@/store/selectors";
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
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function ReviewStep({
  selectedAddress,
  shippingMethod,
  onBack,
}: {
  selectedAddress: Address | null;
  shippingMethod: ShippingMethod | null;
  onBack: () => void;
}) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [loading, setLoading] = useState(false);

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [appliedCode, setAppliedCode] = useState("");

  // Calculate totals
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.priceToman * item.quantity,
    0
  );
  const shippingCost = shippingMethod?.cost || 0;
  const totalBeforeDiscount = itemsTotal + shippingCost;
  const totalToPay = totalBeforeDiscount - appliedDiscount;

  const handleApplyDiscount = async () => {
    if (!discountCode) return toast.error("کد تخفیف را وارد کنید");

    if (discountApplied) {
      toast.error("شما قبلاً یک کد تخفیف اعمال کرده‌اید");
      return;
    }

    try {
      const res = await applyDiscount(discountCode, itemsTotal);
      setAppliedDiscount(res.amount);
      setAppliedCode(res.code);
      setDiscountApplied(true);
      toast.success(`تخفیف ${formatPrice(res.amount)} تومان اعمال شد`);
    } catch (err: any) {
      toast.error(err.message || "کد معتبر نیست");
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(0);
    setDiscountApplied(false);
    setAppliedCode("");
    setDiscountCode("");
    toast.success("کد تخفیف حذف شد");
  };

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
        appliedDiscount,
        shippingMethod?.id || "",
        discountCode
      );

      window.location.href = url;
      dispatch(clear());
    } catch (err: any) {
      toast.error(err.message || "خطا در پرداخت");
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
              <div key={item.id} className="border-b pb-2">
                <div className="flex justify-between">
                  <span>
                    {item.type === "BUNDLE"
                      ? item.name
                      : item.name + " × " + item.quantity}
                  </span>
                  <span>
                    {formatPrice(item.priceToman * item.quantity)} تومان
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">سبد خرید خالی است.</p>
          )}
        </CardContent>
      </Card>

      {/* نمایش جمع کل و تخفیف */}
      <Card className="bg-gray-50 border">
        <CardContent className="text-sm text-gray-800 space-y-2">
          <div className="flex justify-between">
            <span>جمع کل</span>
            <span>{formatPrice(totalBeforeDiscount)} تومان</span>
          </div>

          {appliedDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>تخفیف ({appliedCode})</span>
              <span>- {formatPrice(appliedDiscount)} تومان</span>
            </div>
          )}

          <div className="flex justify-between font-bold border-t pt-2">
            <span>مبلغ قابل پرداخت</span>
            <span>{formatPrice(totalToPay)} تومان</span>
          </div>
        </CardContent>
      </Card>

      {/* کد تخفیف */}
      <Card className="flex gap-2 items-center p-4">
        {!discountApplied ? (
          <div className="flex gap-3 w-full">
            <Input
              placeholder="کد تخفیف"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button onClick={handleApplyDiscount}>اعمال</Button>
          </div>
        ) : (
          <div className="flex w-full justify-between items-center">
            <span className="text-green-600 text-sm">
              کد {appliedCode} اعمال شده است
            </span>
            <Button variant="destructive" onClick={handleRemoveDiscount}>
              حذف
            </Button>
          </div>
        )}
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
