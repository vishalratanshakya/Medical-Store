"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { fetchProducts } from "@/lib/products";
import { fetchSales } from "@/lib/sales";
import { fetchExpenses, type Expense } from "@/lib/expenses";
import type { Product, Sale } from "@/types";

interface SmartDataContextValue {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  loading: boolean;
  isDemoMode: boolean;
  refresh: () => Promise<void>;
}

const SmartDataContext = createContext<SmartDataContextValue | undefined>(undefined);

// Generate realistic dummy products
const DUMMY_PRODUCTS: Product[] = [
  {
    id: "dummy-med-1",
    name: "Paracetamol 650mg",
    category: "medicines",
    mrpRate: 30,
    sellingRate: 25,
    stockQuantity: 150,
    expiryDate: "2027-12-31",
    batchNumber: "PM650-99",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dummy-med-2",
    name: "Amoxicillin 250mg",
    category: "medicines",
    mrpRate: 120,
    sellingRate: 110,
    stockQuantity: 3, // Low stock alert
    expiryDate: "2026-06-30",
    batchNumber: "AM250-12",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dummy-syr-1",
    name: "Benadryl Cough Syrup 100ml",
    category: "syrups",
    mrpRate: 105,
    sellingRate: 95,
    stockQuantity: 2, // Low stock alert
    expiryDate: "2026-11-30",
    batchNumber: "BD100-44",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dummy-tub-1",
    name: "Betnovate-N Skin Cream 20g",
    category: "tubes",
    mrpRate: 75,
    sellingRate: 68,
    stockQuantity: 45,
    expiryDate: "2027-08-31",
    batchNumber: "BT020-03",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dummy-cos-1",
    name: "Cetaphil Moisturizing Lotion",
    category: "cosmetics",
    mrpRate: 490,
    sellingRate: 450,
    stockQuantity: 18,
    expiryDate: "2027-10-15",
    batchNumber: "CP490-88",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dummy-drp-1",
    name: "Dextrose 5% 500ml",
    category: "drips",
    mrpRate: 65,
    sellingRate: 55,
    stockQuantity: 4, // Low stock alert
    expiryDate: "2027-01-31",
    batchNumber: "DX500-11",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Generate realistic dummy sales
const DUMMY_SALES: Sale[] = [
  {
    id: "dummy-sale-1",
    items: [
      {
        productId: "dummy-med-1",
        productName: "Paracetamol 650mg",
        category: "medicines",
        quantity: 2,
        sellingRate: 25,
        mrpRate: 30,
        lineTotal: 50,
        lineCost: 35,
      }
    ],
    totalRevenue: 50,
    totalCost: 35,
    totalItems: 2,
    invoiceNumber: "INV-DUMMY-101",
    createdAt: new Date().toISOString(),
  },
  {
    id: "dummy-sale-2",
    items: [
      {
        productId: "dummy-syr-1",
        productName: "Benadryl Cough Syrup 100ml",
        category: "syrups",
        quantity: 1,
        sellingRate: 95,
        mrpRate: 105,
        lineTotal: 95,
        lineCost: 75,
      }
    ],
    totalRevenue: 95,
    totalCost: 75,
    totalItems: 1,
    invoiceNumber: "INV-DUMMY-102",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  },
  {
    id: "dummy-sale-3",
    items: [
      {
        productId: "dummy-cos-1",
        productName: "Cetaphil Moisturizing Lotion",
        category: "cosmetics",
        quantity: 1,
        sellingRate: 450,
        mrpRate: 490,
        lineTotal: 450,
        lineCost: 320,
      }
    ],
    totalRevenue: 450,
    totalCost: 320,
    totalItems: 1,
    invoiceNumber: "INV-DUMMY-103",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  }
];

// Generate realistic dummy expenses
const DUMMY_EXPENSES: Expense[] = [
  {
    id: "dummy-exp-1",
    productId: "dummy-med-1",
    productName: "Paracetamol 650mg",
    quantity: 100,
    cost: 1500,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "dummy-exp-2",
    productId: "dummy-syr-1",
    productName: "Benadryl Cough Syrup 100ml",
    quantity: 20,
    cost: 1200,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export function SmartDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const realProducts = await fetchProducts();
      const realSales = await fetchSales();
      const realExpenses = await fetchExpenses();

      // Condition: if products collection length === 0, trigger demo mode
      if (realProducts.length === 0) {
        setProducts(DUMMY_PRODUCTS);
        setSales(DUMMY_SALES);
        setExpenses(DUMMY_EXPENSES);
        setIsDemoMode(true);
      } else {
        setProducts(realProducts);
        setSales(realSales);
        setExpenses(realExpenses);
        setIsDemoMode(false);
      }
    } catch (error) {
      console.warn("Failed to fetch Firestore data, using fallback dummy data:", error);
      setProducts(DUMMY_PRODUCTS);
      setSales(DUMMY_SALES);
      setExpenses(DUMMY_EXPENSES);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <SmartDataContext.Provider
      value={{
        products,
        sales,
        expenses,
        loading,
        isDemoMode,
        refresh: loadData,
      }}
    >
      {children}
    </SmartDataContext.Provider>
  );
}

export function useSmartData() {
  const context = useContext(SmartDataContext);
  if (!context) {
    throw new Error("useSmartData must be used within a SmartDataProvider");
  }
  return context;
}
