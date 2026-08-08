"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
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

const ITEMS_PER_PAGE = 15;

export function ProductList({
  products,
  category,
  onRefresh,
  showAddForm = true,
}: ProductListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = products
    .filter((p) => !category || p.category === category)
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.batchNumber.toLowerCase().includes(q)
      );
    });

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const startRange = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${product.name}"?`)) return;
    await deleteProduct(product.id);
    onRefresh();
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or batch..."
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
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full min-w-[900px] table-auto border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                  <th className="px-4 py-4 text-center w-12">S.No</th>
                  <th className="px-4 py-4 text-center w-16">Image</th>
                  <th className="px-6 py-4">Product Name & Batch</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock & Status</th>
                  <th className="px-6 py-4">MRP Rate</th>
                  <th className="px-6 py-4">Selling Rate</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayedProducts.map((product, index) => {
                  const isLowStock = product.stockQuantity < LOW_STOCK_THRESHOLD;
                  const serialNo = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      {/* 1. S.No */}
                      <td className="px-4 py-4 text-center font-medium text-gray-500 dark:text-gray-400">
                        {serialNo}
                      </td>

                      {/* 2. Image */}
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <img
                            src={
                              product.imageUrl ||
                              (product.category === "medicines"
                                ? "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60"
                                : product.category === "syrups"
                                ? "https://images.unsplash.com/photo-1550572017-edd951b55104?w=150&auto=format&fit=crop&q=60"
                                : product.category === "tubes"
                                ? "https://images.unsplash.com/photo-1607619056574-7b8f304b3b8a?w=150&auto=format&fit=crop&q=60"
                                : product.category === "cosmetics"
                                ? "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&auto=format&fit=crop&q=60"
                                : "https://images.unsplash.com/photo-1579154204601-01588f351167?w=150&auto=format&fit=crop&q=60")
                            }
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                          />
                        </div>
                      </td>

                      {/* 3. Product Name & Batch */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Batch: {product.batchNumber || "N/A"}
                          </p>
                        </div>
                      </td>

                      {/* 4. Category */}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                          {CATEGORY_LABELS[product.category]}
                        </span>
                      </td>

                      {/* 5. Stock Quantity & Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "font-bold text-sm",
                              isLowStock
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-gray-950 dark:text-gray-100"
                            )}
                          >
                            {product.stockQuantity} units
                          </span>
                          {isLowStock && (
                            <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. MRP Rate */}
                      <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">
                        {formatCurrency(product.mrpRate)}
                      </td>

                      {/* 7. Selling Rate */}
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(product.sellingRate)}
                      </td>

                      {/* 8. Expiry Date */}
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                        {formatDate(product.expiryDate)}
                      </td>

                      {/* 9. Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/dashboard/products/edit/${product.id}`);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={(e) => handleDelete(e, product)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages >= 1 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
              {/* Left Side: Range Info */}
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{startRange}</span> to{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{endRange}</span> of{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length}</span> products
              </div>

              {/* Right Side: Page Controls */}
              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(pNum)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
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
