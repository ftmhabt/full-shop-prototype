import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";

export default function ShippingAndServiceCard() {
  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-gray-50 text-right">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          ارسال و خدمات پس از فروش
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 space-y-3 leading-relaxed">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>ارسال سریع به سراسر کشور با پست یا تیپاکس</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-orange-500" />
          <span>۷ روز مهلت تست و بازگشت در صورت خرابی</span>
        </div>
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-indigo-500" />
          <span>پشتیبانی فنی و مشاوره نصب ۲۴ ساعته</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>محصولات دارای گارانتی اصالت و سلامت فیزیکی</span>
        </div>
      </CardContent>
    </Card>
  );
}
