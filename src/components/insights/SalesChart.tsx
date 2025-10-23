"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: { day: string; total: number }[];
}

const chartConfig = {
  total: { label: "درآمد", color: "var(--chart-1)" },
};

export default function SalesChart({ data }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-2 text-lg font-semibold text-right">روند فروش</h3>
      <ChartContainer config={chartConfig} dir="rtl">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              tickLine={false}
              fontSize={12}
              reversed
              tick={({ x, y, payload }) => {
                const date = new Date(payload.value);
                // format as "dd/MM" in Persian
                const farsiDate = new Intl.DateTimeFormat("fa-IR", {
                  day: "2-digit",
                  month: "2-digit",
                }).format(date);

                return (
                  <text
                    x={x + 70}
                    y={y} // move below axis line
                    textAnchor="middle" // center under tick
                    dominantBaseline="hanging"
                    fill="#333"
                  >
                    {farsiDate}
                  </text>
                );
              }}
            />
            <YAxis
              tickLine={false}
              fontSize={12}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  textAnchor="start" // align text to start (left)
                  dominantBaseline="middle"
                  fill="#333"
                >
                  {new Intl.NumberFormat("fa-IR").format(payload.value)}
                </text>
              )}
            />
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
    </div>
  );
}
