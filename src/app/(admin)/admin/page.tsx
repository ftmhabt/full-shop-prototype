import { getAllOrders } from "@/app/actions/admin/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Tag, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const orders = await getAllOrders();

  const totalSales = orders.reduce((sum, o) => sum + o.finalPrice, 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + o.discount, 0);
  const uniqueUsers = new Set(orders.map((o) => o.userId)).size;
  const orderStats = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 h-full">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>پنل مدیریت</CardTitle>
        </CardHeader>
        <CardContent>
          <p>سلام ادمین عزیز، به داشبورد مدیریت خوش آمدید!</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            <CardTitle>مجموع فروش</CardTitle>
          </CardHeader>
          <CardContent>{totalSales.toLocaleString()} تومان</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            <CardTitle>مجموع تخفیف‌ها</CardTitle>
          </CardHeader>
          <CardContent>{totalDiscounts.toLocaleString()} تومان</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <CardTitle>کاربران فعال</CardTitle>
          </CardHeader>
          <CardContent>{uniqueUsers} کاربر</CardContent>
        </Card>
      </div>

      {/* Orders by Status */}
      <Card>
        <CardHeader>
          <CardTitle>آمار سفارش‌ها بر اساس وضعیت</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div>پرداخت‌شده: {orderStats.PAID || 0}</div>
          <div>در انتظار پرداخت: {orderStats.PENDING || 0}</div>
          <div>کنسل‌شده: {orderStats.CANCELLED || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}
