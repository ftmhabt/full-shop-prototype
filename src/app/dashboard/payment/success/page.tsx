"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const refId = searchParams.get("refId");

  return (
    <div className="flex justify-center items-center bg-green-50 p-4">
      <Card className="max-w-md w-full shadow-lg rounded-2xl border-green-200">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CheckCircle className="w-16 h-16 text-green-600" />
          <CardTitle className="text-2xl font-bold text-green-700">
            پرداخت موفق
          </CardTitle>
          <p className="text-gray-600 text-sm">سفارش شما با موفقیت ثبت شد.</p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="p-4 rounded-lg bg-green-100 text-green-800 space-y-2 text-sm">
            <p>
              <b>کد سفارش:</b> {orderId}
            </p>
            <p>
              <b>کد رهگیری زرین‌پال:</b> {refId}
            </p>
          </div>
          <Link href="/dashboard/orders" className="mb-1 block">
            <Button className="w-full">مشاهده سفارش‌ها</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              بازگشت به فروشگاه
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
