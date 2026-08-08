import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import type { Product, ProductCategory, Sale } from "@/types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  try {
    return format(parseISO(date), "dd MMM yyyy");
  } catch {
    return date;
  }
}

export function formatDateTime(date: string): string {
  try {
    return format(parseISO(date), "dd MMM yyyy, hh:mm a");
  } catch {
    return date;
  }
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const stamp = format(now, "yyyyMMdd-HHmmss");
  const random = Math.floor(Math.random() * 900 + 100);
  return `INV-${stamp}-${random}`;
}

export function filterProductsByCategory(
  products: Product[],
  category: ProductCategory
): Product[] {
  return products.filter((product) => product.category === category);
}

export function filterSalesByDateRange(
  sales: Sale[],
  startDate: Date,
  endDate: Date
): Sale[] {
  const interval = {
    start: startOfDay(startDate),
    end: endOfDay(endDate),
  };

  return sales.filter((sale) => {
    const saleDate = parseISO(sale.createdAt);
    return isWithinInterval(saleDate, interval);
  });
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
