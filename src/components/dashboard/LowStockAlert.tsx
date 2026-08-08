"use client";

import Link from "next/link";
import { AlertTriangle, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface LowStockAlertProps {
  products: Product[];
  onRestock: (product: Product) => void;
}

export function LowStockAlert({ products, onRestock }: LowStockAlertProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-800 dark:from-emerald-950/50 dark:to-teal-950/50">
        <p className="text-emerald-700 dark:text-emerald-300">
          All products are sufficiently stocked.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 transition-all hover:shadow-md dark:border-amber-800 dark:from-amber-950/40 dark:to-orange-950/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/50">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {product.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {CATEGORY_LABELS[product.category]} · Batch {product.batchNumber}
              </p>
              <p className="mt-1 text-sm font-medium text-amber-700 dark:text-amber-300">
                Only {product.stockQuantity} units left · MRP{" "}
                {formatCurrency(product.mrpRate)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onRestock(product)}
              className="from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <PackagePlus className="h-4 w-4" />
              Restock
            </Button>
            <Link href="/restock">
              <Button size="sm" variant="secondary">
                View All
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
