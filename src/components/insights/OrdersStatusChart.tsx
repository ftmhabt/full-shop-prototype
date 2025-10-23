"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { status: string; count: number }[];
}

const chartConfig = {
  count: { label: "سفارش‌ها", color: "var(--chart-2)" },
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

const statusLabels: Record<string, string> = {
  PENDING: "در انتظار",
  PAID: "پرداخت شده",
  SHIPPED: "ارسال شده",
  COMPLETED: "تکمیل شده",
  CANCELED: "لغو شده",
};

export default function OrdersStatusChart({ data }: Props) {
  const translatedData = data.map((d) => ({
    ...d,
    status: statusLabels[d.status] || d.status,
  }));

  return (
    <div className="rounded-xl border bg-card p-4 rtl">
      <h3 className="mb-2 text-lg font-semibold text-right">وضعیت سفارش‌ها</h3>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={translatedData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 20;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#333"
                    textAnchor={x > cx ? "end" : "start"}
                    dominantBaseline="central"
                  >
                    {name} ({(percent * 100).toFixed(0)}%)
                  </text>
                );
              }}
            >
              {translatedData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
