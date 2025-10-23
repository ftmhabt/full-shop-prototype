import {
  getDashboardStats,
  getOrdersByStatus,
  getSalesTrend,
} from "@/app/actions/insights/overview";
import OrdersStatusChart from "@/components/insights/OrdersStatusChart";
import { OverviewCards } from "@/components/insights/OverviewCards";
import SalesChart from "@/components/insights/SalesChart";

export default async function DashboardPage() {
  const [stats, salesTrend, ordersStatus] = await Promise.all([
    getDashboardStats(),
    getSalesTrend(),
    getOrdersByStatus(),
  ]);

  return (
    <div className="space-y-6 p-6">
      {/* Summary Cards */}
      <OverviewCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 w-full h-64 sm:h-80 md:h-96 lg:h-96">
        <SalesChart data={salesTrend} />
        <OrdersStatusChart data={ordersStatus} />
      </div>
    </div>
  );
}
