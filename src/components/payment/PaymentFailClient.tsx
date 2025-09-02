"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex justify-center items-center bg-red-50 p-4">
      <Card className="max-w-md w-full shadow-lg rounded-2xl border-red-200">
        <CardHeader className="flex flex-col items-center space-y-2">
          <XCircle className="w-16 h-16 text-red-600" />
          <CardTitle className="text-2xl font-bold text-red-700">
            پرداخت ناموفق
          </CardTitle>
          <p className="text-gray-600 text-sm">
            متاسفانه پرداخت شما انجام نشد.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="p-4 rounded-lg bg-red-100 text-red-800 space-y-2 text-sm">
            <p>
              <b>کد سفارش:</b> {orderId}
            </p>
            <p>لطفا دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.</p>
          </div>
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
