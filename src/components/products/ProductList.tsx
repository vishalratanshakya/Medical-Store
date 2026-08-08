"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "@/components/products/ProductForm";
import { deleteProduct } from "@/lib/products";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types";
import {
  CATEGORY_LABELS,
  LOW_STOCK_THRESHOLD,
} from "@/types";

interface ProductListProps {
  products: Product[];
  category?: ProductCategory;
  onRefresh: () => void;
  showAddForm?: boolean;
}

export function ProductList({
  products,
  category,
  onRefresh,
  showAddForm = true,
}: ProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = products
    .filter((p) => !category || p.category === category)
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.batchNumber.toLowerCase().includes(q)
      );
    });

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    await deleteProduct(product.id);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or batch number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        {showAddForm && (
          <Button onClick={() => router.push(category ? `/dashboard/products/add?category=${category}` : "/dashboard/products/add")} className="self-end sm:self-auto">
            Add Product
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No products found. Add your first product to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[800px] table-auto border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">MRP</th>
                <th className="px-6 py-4">Selling Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <span>{product.name}</span>
                      <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatCurrency(product.mrpRate)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatCurrency(product.sellingRate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-semibold",
                          product.stockQuantity < LOW_STOCK_THRESHOLD
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-900 dark:text-white"
                        )}
                      >
                        {product.stockQuantity} units
                      </span>
                      {product.stockQuantity < LOW_STOCK_THRESHOLD && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {product.batchNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(product.expiryDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
        size="lg"
      >
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSuccess={() => {
              setEditingProduct(null);
              onRefresh();
            }}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </Modal>
    </div>
  );
}
