"use client";

import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BillingPOS } from "@/components/billing/BillingPOS";
import { useProducts } from "@/hooks/useProducts";

export default function BillingPage() {
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
        title="Billing / POS"
        description="Point of sale checkout with instant invoice generation"
      />
      <BillingPOS products={products} onSaleComplete={refresh} />
    </div>
  );
}
