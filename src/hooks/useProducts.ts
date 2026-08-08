"use client";

import { useSmartData } from "@/context/SmartDataContext";

export function useProducts() {
  const { products, loading, refresh } = useSmartData();
  return { products, loading, error: null, refresh };
}
