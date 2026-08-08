"use client";

import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import {
  aggregateRevenueByPeriod,
  calculateRangeSummary,
} from "@/lib/analytics";
import { filterSalesByDateRange, formatCurrency } from "@/lib/utils";
import type { RevenuePeriod } from "@/types";
import { cn } from "@/lib/utils";
import {
  IndianRupee,
  TrendingDown,
  ShoppingBag,
  Receipt,
} from "lucide-react";

const periods: { value: RevenuePeriod; label: string }[] = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
];

import { useSmartData } from "@/context/SmartDataContext";

export default function AnalyticsPage() {
  const { sales, loading: salesLoading } = useSales();
  const { products, loading: productsLoading } = useProducts();
  const { expenses } = useSmartData();
  const [period, setPeriod] = useState<RevenuePeriod>("day");
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const loading = salesLoading || productsLoading;

  const filteredSales = useMemo(() => {
    return filterSalesByDateRange(
      sales,
      new Date(startDate),
      new Date(endDate)
    );
  }, [sales, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.createdAt);
      return date >= new Date(startDate) && date <= new Date(endDate + "T23:59:59");
    });
  }, [expenses, startDate, endDate]);

  const totalExpenseCost = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.cost, 0);
  }, [filteredExpenses]);

  const summary = useMemo(() => {
    const saleSummary = calculateRangeSummary(filteredSales);
    return {
      ...saleSummary,
      totalCost: saleSummary.totalCost + totalExpenseCost,
    };
  }, [filteredSales, totalExpenseCost]);

  const chartData = useMemo(() => {
    const baseChartData = aggregateRevenueByPeriod(filteredSales, period);
    
    // Distribute expenses into the cost array in chartData
    return baseChartData.map((dataPoint) => {
      const pointDate = dataPoint.label; // e.g. "09 Aug" or similar format
      
      const pointExpenses = filteredExpenses.filter((e) => {
        const formatted = format(new Date(e.createdAt), period === "day" ? "dd MMM" : "dd MMM"); // match formats
        return formatted === pointDate;
      });
      const pointExpenseSum = pointExpenses.reduce((sum, e) => sum + e.cost, 0);
      return {
        ...dataPoint,
        cost: dataPoint.cost + pointExpenseSum,
      };
    });
  }, [filteredSales, filteredExpenses, period]);

  const profit = summary.totalRevenue - summary.totalCost;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Sales & Revenue Analytics"
        description="Track revenue, costs, and product sales with interactive charts"
      />

      <div className="mb-6">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          subtitle="In selected date range"
          icon={<IndianRupee className="h-6 w-6" />}
          gradient="from-blue-500 to-indigo-600"
        />
        <MetricCard
          title="Total Investment / Cost"
          value={formatCurrency(summary.totalCost)}
          subtitle="MRP-based cost expenses"
          icon={<TrendingDown className="h-6 w-6" />}
          gradient="from-amber-500 to-orange-600"
        />
        <MetricCard
          title="Products Sold"
          value={summary.totalItems}
          subtitle={`${summary.totalSales} transactions`}
          icon={<ShoppingBag className="h-6 w-6" />}
          gradient="from-emerald-500 to-teal-600"
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(profit)}
          subtitle="Revenue minus cost"
          icon={<Receipt className="h-6 w-6" />}
          gradient="from-violet-500 to-purple-600"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              period === p.value
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Revenue vs Cost ({period.charAt(0).toUpperCase() + period.slice(1)})
          </h2>
          <RevenueChart data={chartData} />
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-amber-500" />
              <span className="text-gray-600 dark:text-gray-400">Cost</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Product Category Distribution
          </h2>
          <CategoryDistributionChart products={products} />
        </div>
      </div>
    </div>
  );
}
