"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: { label: string; revenue: number; cost: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-gray-500 dark:text-gray-400">
        No sales data for selected period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis
          dataKey="label"
          tick={{ fill: "currentColor", fontSize: 12 }}
          className="text-gray-600 dark:text-gray-400"
        />
        <YAxis
          tick={{ fill: "currentColor", fontSize: 12 }}
          className="text-gray-600 dark:text-gray-400"
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value, name) => [
            formatCurrency(Number(value)),
            name === "revenue" ? "Revenue" : "Cost",
          ]}
          contentStyle={{
            backgroundColor: "var(--tooltip-bg, #fff)",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="revenue" />
        <Bar dataKey="cost" fill="#f59e0b" radius={[6, 6, 0, 0]} name="cost" />
      </BarChart>
    </ResponsiveContainer>
  );
}
