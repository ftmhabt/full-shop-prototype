import {
  getActiveDiscounts,
  getDashboardStats,
  getLowStockProducts,
  getNewUsers,
  getRecentOrders,
  getRevenueTrend,
  getTopProducts,
} from "@/app/actions/admin/dashboard";
import { ActiveDiscounts } from "@/components/admin/ActiveDiscounts";
import { LowStockProducts } from "@/components/admin/LowStockProducts";
import { NewUsers } from "@/components/admin/NewUsers";
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatCard } from "@/components/admin/StatCard";
import { TopProducts } from "@/components/admin/TopProducts";
import { Clock, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default async function DashboardPage() {
  const [
    stats,
    revenueTrend,
    recentOrders,
    topProducts,
    newUsers,
    lowStock,
    activeDiscounts,
  ] = await Promise.all([
    getDashboardStats(),
    getRevenueTrend(),
    getRecentOrders(),
    getTopProducts(),
    getNewUsers(),
    getLowStockProducts(),
    getActiveDiscounts(),
  ]);

  return (
    <div className="space-y-6">
      {/* ردیف اول */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="درآمد کل"
          value={`${stats.totalRevenue.toLocaleString()} تومان`}
          icon={<DollarSign />}
        />
        <StatCard
          title="تعداد سفارش‌ها"
          value={stats.totalOrders}
          icon={<Package />}
        />
        <StatCard title="کاربران" value={stats.totalUsers} icon={<Users />} />
        <StatCard
          title="محصولات"
          value={stats.totalProducts}
          icon={<ShoppingCart />}
        />
        <StatCard
          title="در انتظار"
          value={stats.pendingOrders}
          icon={<Clock />}
        />
      </div>

      {/* ردیف دوم */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <RevenueChart
          data={revenueTrend.map((d) => ({
            date: d.date.toString(),
            total: Number(d.total),
          }))}
        />
        <RecentOrdersTable orders={recentOrders} />
      </div>

      {/* ردیف سوم */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <TopProducts products={topProducts} />
        <NewUsers users={newUsers} />
      </div>

      {/* ردیف چهارم */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <LowStockProducts products={lowStock} />
        <ActiveDiscounts discounts={activeDiscounts} />
      </div>
    </div>
  );
}
