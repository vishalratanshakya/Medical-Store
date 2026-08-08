"use client";

import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductList } from "@/components/products/ProductList";
import { useProducts } from "@/hooks/useProducts";

export default function DripsPage() {
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
        title="Drips"
        description="Manage IV drips and related medical supplies"
      />
      <ProductList products={products} category="drips" onRefresh={refresh} />
    </div>
  );
}
