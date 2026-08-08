"use client";

import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductList } from "@/components/products/ProductList";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const { products, loading, refresh } = useProducts();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Product Inventory"
        description="View and manage all products across your medical store inventory"
      />
      <ProductList
        products={products}
        onRefresh={refresh}
      />
    </div>
  );
}
