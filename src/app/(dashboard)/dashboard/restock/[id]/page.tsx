"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, PackagePlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useProducts } from "@/hooks/useProducts";
import { restockProduct } from "@/lib/products";
import { createExpense } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_GRADIENTS } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RestockProductPage({ params }: PageProps) {
  const { id: productId } = use(params);
  const router = useRouter();

  const { products, loading, refresh } = useProducts();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [quantity, setQuantity] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const selectedProduct = products.find((p) => p.id === productId);

  useEffect(() => {
    if (selectedProduct) {
      setBatchNumber(selectedProduct.batchNumber);
      setExpiryDate(selectedProduct.expiryDate);
    }
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedProduct) {
      setError("Product not found");
      return;
    }
    if (quantity <= 0) {
      setError("Please enter a valid quantity to add");
      return;
    }
    if (cost <= 0) {
      setError("Please enter a valid investment purchase cost");
      return;
    }

    try {
      setSaving(true);

      // 1. Update the inventory stock level in Firebase
      await restockProduct(selectedProduct.id, quantity);

      // 2. Log investment cost as expense
      await createExpense({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        cost,
      });

      setSuccess(true);
      await refresh();

      // Redirect after showing success toast
      setTimeout(() => {
        router.push("/dashboard/restock");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record restock");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center space-y-4">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Product not found</p>
        <Button onClick={() => router.push("/dashboard/restock")}>
          Back to Restock List
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {success && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-white shadow-xl animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="h-5 w-5 animate-bounce" />
          <span className="font-medium">Restock updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Header and Back Button */}
      <div>
        <button
          onClick={() => router.push("/dashboard/restock")}
          className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Restock List
        </button>
        <PageHeader
          title={`Restock Product: ${selectedProduct.name}`}
          description={`Update stock levels and log transaction investments for billing calculations.`}
        />
      </div>

      {/* Info Card */}
      <div className={cn(
        "rounded-2xl p-6 shadow-md grid gap-4 sm:grid-cols-3 text-white bg-gradient-to-r",
        CATEGORY_GRADIENTS[selectedProduct.category]
      )}>
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/70">Category</span>
          <span className="text-sm font-bold text-white">
            {CATEGORY_LABELS[selectedProduct.category]}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/70">Current Stock</span>
          <span className="text-sm font-bold text-white">
            {selectedProduct.stockQuantity} units
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/70">Current Batch</span>
          <span className="text-sm font-bold text-white">
            {selectedProduct.batchNumber || "N/A"}
          </span>
        </div>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900 space-y-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Restock Input Form</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Add Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              value={quantity || ""}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. 100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Purchase Cost (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={cost || ""}
              onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Total investment price paid"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              New Batch Number (Optional)
            </label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Update batch code"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              New Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/restock")} className="px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="px-6">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <PackagePlus className="h-4 w-4" />
                Complete Restock
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
