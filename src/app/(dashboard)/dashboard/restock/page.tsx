"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, PackagePlus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { CATEGORY_LABELS, LOW_STOCK_THRESHOLD } from "@/types";

const ITEMS_PER_PAGE = 15;

export default function RestockListPage() {
  const router = useRouter();
  const { products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);

  const lowStockProducts = products
    .filter((p) => p.stockQuantity < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stockQuantity - b.stockQuantity);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const totalPages = Math.ceil(lowStockProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = lowStockProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const startRange = lowStockProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, lowStockProducts.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Header Navigation */}
      <div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <PageHeader
          title="Restock / Low Stock Alert"
          description={`Products with stock below ${LOW_STOCK_THRESHOLD} units require immediate restocking`}
        />
      </div>

      {/* Items Need Restocking Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8" />
          <div>
            <p className="text-2xl font-bold">{lowStockProducts.length}</p>
            <p className="text-sm text-white/80">Items need restocking</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout - Table only */}
      {lowStockProducts.length === 0 ? (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-12 text-center dark:border-emerald-800 dark:from-emerald-950/40 dark:to-teal-950/40">
          <p className="text-lg font-medium text-emerald-700 dark:text-emerald-300">
            All products are well stocked!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    MRP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Expiry
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Batch: {product.batchNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {CATEGORY_LABELS[product.category]}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                        {product.stockQuantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(product.mrpRate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(product.expiryDate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/dashboard/restock/${product.id}`)}
                      >
                        <PackagePlus className="h-4 w-4" />
                        Select to Restock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages >= 1 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
                  className="px-3"
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
                      className={cn("w-8 h-8 p-0 flex items-center justify-center rounded-xl", currentPage === pNum && "shadow-md shadow-blue-500/20")}
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
                  className="px-3"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
