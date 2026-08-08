"use client";

import { useState } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StockTrendChart } from "@/components/dashboard/StockTrendChart";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { LOW_STOCK_THRESHOLD, CATEGORY_LABELS, CATEGORY_GRADIENTS, type Product } from "@/types";
import { restockProduct } from "@/lib/products";

export default function DashboardPage() {
  const router = useRouter();
  const { products, loading: productsLoading } = useProducts();
  const { sales, loading: salesLoading } = useSales();
  const [currentPage, setCurrentPage] = useState(1);

  const loading = productsLoading || salesLoading;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity < LOW_STOCK_THRESHOLD
  );

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(lowStockProducts.length / ITEMS_PER_PAGE);
  const displayedLowStock = lowStockProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const startRange = lowStockProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, lowStockProducts.length);
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.sellingRate * p.stockQuantity,
    0
  );
  const todayRevenue = sales
    .filter((s) => {
      const saleDate = new Date(s.createdAt).toDateString();
      return saleDate === new Date().toDateString();
    })
    .reduce((sum, s) => sum + s.totalRevenue, 0);

  const categoryCounts = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {})
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Overview of inventory, sales, and stock alerts
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={products.length}
          subtitle="Across all categories"
          icon={<Package className="h-6 w-6" />}
          gradient="from-blue-500 to-indigo-600"
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          subtitle={`Below ${LOW_STOCK_THRESHOLD} units`}
          icon={<AlertTriangle className="h-6 w-6" />}
          gradient="from-amber-500 to-orange-600"
        />
        <MetricCard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          subtitle="Sales today"
          icon={<TrendingUp className="h-6 w-6" />}
          gradient="from-emerald-500 to-teal-600"
        />
        <MetricCard
          title="Inventory Value"
          value={formatCurrency(totalStockValue)}
          subtitle="At selling rates"
          icon={<IndianRupee className="h-6 w-6" />}
          gradient="from-violet-500 to-purple-600"
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Stock vs Restock Levels
          </h2>
          <StockTrendChart products={products} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Category Distribution
          </h2>
          <CategoryDistributionChart products={products} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Products by Category
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categoryCounts.map(([category, count]) => (
            <div
              key={category}
              className={cn(
                "rounded-xl bg-gradient-to-br p-4 text-white shadow-sm transition-transform hover:scale-[1.02]",
                CATEGORY_GRADIENTS[category as keyof typeof CATEGORY_GRADIENTS]
              )}
            >
              <p className="text-2xl font-bold">
                {count}
              </p>
              <p className="text-sm opacity-90 font-medium">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Low Stock Alerts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Products requiring attention.
            </p>
          </div>
          <span className="rounded-full bg-red-50 dark:bg-red-950/30 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-900/50">
            [ {lowStockProducts.length} items ]
          </span>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            All products are fully stocked!
          </p>
        ) : (
          <div className="space-y-4">
            <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
              {displayedLowStock.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3 transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/50 px-2"
                >
                  {/* Left: Name & Category subtext */}
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {CATEGORY_LABELS[p.category]}
                    </p>
                  </div>

                  {/* Center: Stock count badge & warning */}
                  <div className="flex items-center gap-3 sm:flex-1 sm:justify-center">
                    <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      Stock: {p.stockQuantity} units
                    </span>
                    <span className="rounded-full bg-red-100 dark:bg-red-950/40 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
                      Low Stock
                    </span>
                  </div>

                  {/* Right: Restock Action Button */}
                  <div className="flex sm:justify-end">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/dashboard/restock/${p.id}`)}
                      className="px-4"
                    >
                      Restock
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages >= 1 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 dark:border-gray-800 pt-4 transition-colors">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{startRange}</span> to{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{endRange}</span> of{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{lowStockProducts.length}</span> products
                </div>

                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-2.5 py-1 text-xs"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pNum = idx + 1;
                    return (
                      <Button
                        key={pNum}
                        size="sm"
                        variant={currentPage === pNum ? "primary" : "secondary"}
                        onClick={() => setCurrentPage(pNum)}
                        className={cn("w-7 h-7 p-0 flex items-center justify-center rounded-lg text-xs", currentPage === pNum && "shadow-md shadow-blue-500/20")}
                      >
                        {pNum}
                      </Button>
                    );
                  })}

                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-2.5 py-1 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
