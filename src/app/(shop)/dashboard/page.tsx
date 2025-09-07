import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { getUserOrders } from "../../actions/orders";

export default async function DashboardPage() {
  const orders = await getUserOrders();
  const lastOrder = orders[0];
  return (
    <div className="space-y-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>خوش آمدید!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>سلام کاربر عزیز، به حساب کاربری خود خوش آمدید!</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <CardTitle>آخرین سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            {lastOrder ? (
              <div>
                <p>سفارش شماره #{lastOrder.id}</p>
                <p>وضعیت: {lastOrder.status}</p>
                <p>مبلغ نهایی: {lastOrder.finalPrice.toLocaleString()} تومان</p>
              </div>
            ) : (
              <p>هیچ سفارشی ثبت نشده است.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
