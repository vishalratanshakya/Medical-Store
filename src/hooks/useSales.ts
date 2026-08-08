"use client";

import { useSmartData } from "@/context/SmartDataContext";

export function useSales() {
  const { sales, loading, refresh } = useSmartData();
  return { sales, loading, error: null, refresh };
}
