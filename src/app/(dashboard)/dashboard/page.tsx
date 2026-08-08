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
  const { products, loading: productsLoading, refresh } = useProducts();
  const { sales, loading: salesLoading } = useSales();

  const [restockItem, setRestockItem] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState("");

  const handleConfirmRestock = async () => {
    if (!restockItem || restockQty <= 0) return;
    try {
      await restockProduct(restockItem.id, restockQty);
      setToastMsg(`Successfully restocked ${restockQty} units of ${restockItem.name}!`);
      setTimeout(() => setToastMsg(""), 3000);
      setRestockItem(null);
      setRestockQty(0);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restock");
    }
  };

  const loading = productsLoading || salesLoading;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity < LOW_STOCK_THRESHOLD
  );
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
          <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
            {lowStockProducts.map((p) => (
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
                    onClick={() => setRestockItem(p)}
                    className="px-4"
                  >
                    Restock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-white shadow-xl animate-in slide-in-from-top duration-300">
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Small Inline Restock Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Restock: {restockItem.name}
              </h3>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Current Stock:</span>
                <span className="font-semibold text-gray-950 dark:text-white">{restockItem.stockQuantity} units</span>
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={restockQty || ""}
                  onChange={(e) => setRestockQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. 50"
                  autoFocus
                />
              </div>

              <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-gray-900 dark:text-white font-medium">
                <span>New Stock Preview:</span>
                <span>{restockItem.stockQuantity + restockQty} units</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setRestockItem(null); setRestockQty(0); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmRestock}
                disabled={restockQty <= 0}
              >
                Restock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
