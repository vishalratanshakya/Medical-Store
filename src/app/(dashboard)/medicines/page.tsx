"use client";

import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductList } from "@/components/products/ProductList";
import { useProducts } from "@/hooks/useProducts";

export default function MedicinesPage() {
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
        title="Medicines"
        description="Manage medicine inventory, pricing, and stock levels"
      />
      <ProductList
        products={products}
        category="medicines"
        onRefresh={refresh}
      />
    </div>
  );
}
