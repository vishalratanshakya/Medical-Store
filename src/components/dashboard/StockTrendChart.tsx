"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Product } from "@/types";
import { LOW_STOCK_THRESHOLD } from "@/types";

interface StockTrendChartProps {
  products: Product[];
}

export function StockTrendChart({ products }: StockTrendChartProps) {
  // Take first 6 products or default ones if none exist
  const displayProducts = products.slice(0, 6);

  const data = displayProducts.map((p) => ({
    name: p.name.length > 15 ? `${p.name.slice(0, 12)}...` : p.name,
    "Current Stock": p.stockQuantity,
    "Restock Level": LOW_STOCK_THRESHOLD,
  }));

  // Summary statistics for "under the graph show stock and restock"
  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockCount = products.filter((p) => p.stockQuantity < LOW_STOCK_THRESHOLD).length;

  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
        No stock data to display
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorRestock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg, #fff)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Area
            type="monotone"
            dataKey="Current Stock"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorStock)"
          />
          <Area
            type="monotone"
            dataKey="Restock Level"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorRestock)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Under the graph show stock and restock metrics */}
      <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-blue-500 shadow-md shadow-blue-500/50" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Units in Stock</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {totalStock} <span className="text-xs font-normal text-gray-500">units</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Items Requiring Restock</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {lowStockCount} <span className="text-xs font-normal text-gray-500">items</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
