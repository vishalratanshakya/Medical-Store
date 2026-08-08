export type ProductCategory =
  | "medicines"
  | "syrups"
  | "tubes"
  | "cosmetics"
  | "drips";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  mrpRate: number;
  sellingRate: number;
  stockQuantity: number;
  expiryDate: string;
  batchNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  category: ProductCategory;
  mrpRate: number;
  sellingRate: number;
  stockQuantity: number;
  expiryDate: string;
  batchNumber: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  sellingRate: number;
  mrpRate: number;
  lineTotal: number;
  lineCost: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalRevenue: number;
  totalCost: number;
  totalItems: number;
  invoiceNumber: string;
  createdAt: string;
}

export interface CartItem extends SaleItem {
  availableStock: number;
}

export type RevenuePeriod = "day" | "week" | "month" | "year";

export const LOW_STOCK_THRESHOLD = 10;

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  medicines: "Medicines",
  syrups: "Syrups",
  tubes: "Face Tubes & Other Tubes",
  cosmetics: "Cosmetics",
  drips: "Drips",
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  medicines: "#3b82f6",
  syrups: "#10b981",
  tubes: "#8b5cf6",
  cosmetics: "#ec4899",
  drips: "#f59e0b",
};

export const CATEGORY_GRADIENTS: Record<ProductCategory, string> = {
  medicines: "from-blue-500 to-indigo-600",
  syrups: "from-emerald-500 to-teal-600",
  tubes: "from-violet-500 to-purple-600",
  cosmetics: "from-pink-500 to-rose-600",
  drips: "from-amber-500 to-orange-600",
};
