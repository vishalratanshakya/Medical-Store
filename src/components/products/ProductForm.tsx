"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createProduct, updateProduct } from "@/lib/products";
import type { Product, ProductCategory, ProductFormData } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { Loader2 } from "lucide-react";

interface ProductFormProps {
  defaultCategory?: ProductCategory;
  product?: Product;
  onSuccess: () => void;
  onCancel?: () => void;
}

const categories: ProductCategory[] = [
  "medicines",
  "syrups",
  "tubes",
  "cosmetics",
  "drips",
];

export function ProductForm({
  defaultCategory = "medicines",
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? "",
    category: product?.category ?? defaultCategory,
    mrpRate: product?.mrpRate ?? 0,
    sellingRate: product?.sellingRate ?? 0,
    stockQuantity: product?.stockQuantity ?? 0,
    expiryDate: product?.expiryDate ?? "",
    batchNumber: product?.batchNumber ?? "",
  });

  const handleChange = (
    field: keyof ProductFormData,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    try {
      setLoading(true);
      if (product) {
        await updateProduct(product.id, form);
      } else {
        await createProduct(form);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputClass}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              handleChange("category", e.target.value as ProductCategory)
            }
            className={inputClass}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Batch Number
          </label>
          <input
            type="text"
            value={form.batchNumber}
            onChange={(e) => handleChange("batchNumber", e.target.value)}
            className={inputClass}
            placeholder="BATCH-001"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            MRP Rate (₹)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.mrpRate || ""}
            onChange={(e) => handleChange("mrpRate", parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Selling Rate (₹)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.sellingRate || ""}
            onChange={(e) =>
              handleChange("sellingRate", parseFloat(e.target.value) || 0)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stock Quantity
          </label>
          <input
            type="number"
            min="0"
            value={form.stockQuantity || ""}
            onChange={(e) =>
              handleChange("stockQuantity", parseInt(e.target.value, 10) || 0)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expiry Date
          </label>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : product ? (
            "Update Product"
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
}
