import { getEditorStats } from "@/app/actions/admin/blogStats";
import { getAllOrders } from "@/app/actions/admin/orders";
import { getCurrentUser } from "@/app/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, FolderOpen, Tag, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [orders, blogStats] = await Promise.all([
    user.role === "ADMIN" ? getAllOrders() : Promise.resolve([]),
    getEditorStats(),
  ]);

  const isAdmin = user.role === "ADMIN";

  const totalSales = isAdmin
    ? orders.reduce((sum, o) => sum + o.finalPrice, 0)
    : 0;
  const totalDiscounts = isAdmin
    ? orders.reduce((sum, o) => sum + o.discount, 0)
    : 0;
  const uniqueUsers = isAdmin ? new Set(orders.map((o) => o.userId)).size : 0;
  const orderStats = isAdmin
    ? orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <div className="space-y-4 h-full">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>{isAdmin ? "پنل مدیریت" : "پنل نویسنده"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {isAdmin
              ? "سلام ادمین عزیز، به داشبورد مدیریت خوش آمدید!"
              : "سلام نویسنده عزیز، به بخش مدیریت وبلاگ خوش آمدید!"}
          </p>
        </CardContent>
      </Card>

      {isAdmin && (
        <>
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
              <div>کنسل‌شده: {orderStats.CANCELED || 0}</div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>آمار وبلاگ</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" /> پست‌ها: {blogStats.totalPosts}
          </div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" /> دسته‌بندی‌ها:{" "}
            {blogStats.totalCategories}
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5" /> برچسب‌ها: {blogStats.totalTags}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
