import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
// import { getAllOrders } from "../actions/orders";

export default async function AdminDashboardPage() {
  //   const orders = await getAllOrders();
  //   const lastOrder = orders[0];

  return (
    <div className="space-y-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>پنل مدیریت</CardTitle>
        </CardHeader>
        <CardContent>
          <p>سلام ادمین عزیز، به داشبورد مدیریت خوش آمدید!</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <CardTitle>آخرین سفارش ثبت‌شده</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {lastOrder ? (
              <div>
                <p>سفارش شماره #{lastOrder.id}</p>
                <p>کاربر: {lastOrder.user?.name ?? "ناشناس"}</p>
                <p>وضعیت: {lastOrder.status}</p>
                <p>مبلغ نهایی: {lastOrder.finalPrice.toLocaleString()} تومان</p>
              </div>
            ) : ( */}
            <p>هیچ سفارشی ثبت نشده است.</p>
            {/* )} */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آمار کلی</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              تعداد کل سفارش‌ها:
              {/* {orders?.length} */}
            </p>
            {/* می‌تونی آمارهای دیگه مثل مجموع فروش یا تعداد کاربران رو هم اینجا نشون بدی */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
