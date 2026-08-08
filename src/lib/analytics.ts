import {
  format,
  parseISO,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
} from "date-fns";
import type { RevenuePeriod, Sale } from "@/types";
import { filterSalesByDateRange } from "@/lib/utils";

export function aggregateRevenueByPeriod(
  sales: Sale[],
  period: RevenuePeriod
): { label: string; revenue: number; cost: number }[] {
  if (sales.length === 0) return [];

  const dates = sales.map((s) => parseISO(s.createdAt));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  if (period === "day") {
    const days = eachDayOfInterval({ start: minDate, end: maxDate });
    return days.map((day) => {
      const daySales = filterSalesByDateRange(sales, day, day);
      return {
        label: format(day, "dd MMM"),
        revenue: daySales.reduce((sum, s) => sum + s.totalRevenue, 0),
        cost: daySales.reduce((sum, s) => sum + s.totalCost, 0),
      };
    });
  }

  if (period === "week") {
    const weeks = eachWeekOfInterval(
      { start: startOfWeek(minDate), end: maxDate },
      { weekStartsOn: 1 }
    );
    return weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekSales = filterSalesByDateRange(sales, weekStart, weekEnd);
      return {
        label: format(weekStart, "dd MMM"),
        revenue: weekSales.reduce((sum, s) => sum + s.totalRevenue, 0),
        cost: weekSales.reduce((sum, s) => sum + s.totalCost, 0),
      };
    });
  }

  if (period === "month") {
    const months = eachMonthOfInterval({ start: minDate, end: maxDate });
    return months.map((monthStart) => {
      const monthEnd = endOfMonth(monthStart);
      const monthSales = filterSalesByDateRange(sales, monthStart, monthEnd);
      return {
        label: format(monthStart, "MMM yyyy"),
        revenue: monthSales.reduce((sum, s) => sum + s.totalRevenue, 0),
        cost: monthSales.reduce((sum, s) => sum + s.totalCost, 0),
      };
    });
  }

  const years = eachYearOfInterval({ start: minDate, end: maxDate });
  return years.map((yearStart) => {
    const yearEnd = endOfYear(yearStart);
    const yearSales = filterSalesByDateRange(sales, yearStart, yearEnd);
    return {
      label: format(yearStart, "yyyy"),
      revenue: yearSales.reduce((sum, s) => sum + s.totalRevenue, 0),
      cost: yearSales.reduce((sum, s) => sum + s.totalCost, 0),
    };
  });
}

export function calculateRangeSummary(sales: Sale[]) {
  return {
    totalRevenue: sales.reduce((sum, s) => sum + s.totalRevenue, 0),
    totalCost: sales.reduce((sum, s) => sum + s.totalCost, 0),
    totalItems: sales.reduce((sum, s) => sum + s.totalItems, 0),
    totalSales: sales.length,
  };
}

export function getCategorySalesBreakdown(sales: Sale[]) {
  const breakdown: Record<string, number> = {};

  for (const sale of sales) {
    for (const item of sale.items) {
      breakdown[item.category] = (breakdown[item.category] ?? 0) + item.quantity;
    }
  }

  return breakdown;
}

export {
  startOfDay,
  endOfDay,
};
