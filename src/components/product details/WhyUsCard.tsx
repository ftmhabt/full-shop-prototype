import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Lock, Shield, Star } from "lucide-react";

export default function WhyUsCard() {
  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white text-right">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          مزایای خرید از ما
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 space-y-3 leading-relaxed">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span>ضمانت اصالت و کیفیت تمامی محصولات</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>پرداخت امن از درگاه‌های معتبر بانکی</span>
        </div>
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-indigo-500" />
          <span>پشتیبانی واقعی توسط تیم متخصص</span>
        </div>
      </CardContent>
    </Card>
  );
}
