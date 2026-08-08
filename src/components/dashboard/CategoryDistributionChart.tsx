"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { CATEGORY_COLORS, CATEGORY_LABELS, type ProductCategory } from "@/types";
import type { Product } from "@/types";

interface CategoryDistributionChartProps {
  products: Product[];
}

export function CategoryDistributionChart({
  products,
}: CategoryDistributionChartProps) {
  const categories: ProductCategory[] = [
    "medicines",
    "syrups",
    "tubes",
    "cosmetics",
    "drips",
  ];

  const data = categories.map((category) => ({
    name: CATEGORY_LABELS[category],
    value: products.filter((p) => p.category === category).length,
    category,
  }));

  const filteredData = data.filter((item) => item.value > 0);

  if (filteredData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
        No products to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={4}
          dataKey="value"
        >
          {filteredData.map((entry) => (
            <Cell
              key={entry.category}
              fill={CATEGORY_COLORS[entry.category]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--tooltip-bg, #fff)",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Legend
          formatter={(value) => (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
