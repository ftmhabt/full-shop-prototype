"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "../ui/chart";

const chartConfig = {
  total: { label: "درآمد", color: "var(--chart-1)" },
};

export function RevenueChart({
  data,
}: {
  data: { date: string; total: number }[];
}) {
  console.log("data", data);
  return (
    <Card className="col-span-3 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          درآمد ۳۰ روز گذشته
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} dir="rtl">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

export function ChartTooltipContent({ active, payload }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const dataPoint = payload[0].payload;
  return (
    <div className="bg-white p-2 shadow rounded">
      <div>{new Date(dataPoint.date).toLocaleString("fa-IR")}</div>
      <div>{formatPrice(dataPoint.total)} تومان</div>
    </div>
  );
}
