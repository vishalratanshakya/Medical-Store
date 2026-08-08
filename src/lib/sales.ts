import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { decrementStock } from "@/lib/products";
import type { Sale, SaleItem } from "@/types";

const SALES_COLLECTION = "sales";

function mapSale(id: string, data: Record<string, unknown>): Sale {
  return {
    id,
    items: (data.items as SaleItem[]) ?? [],
    totalRevenue: Number(data.totalRevenue ?? 0),
    totalCost: Number(data.totalCost ?? 0),
    totalItems: Number(data.totalItems ?? 0),
    invoiceNumber: String(data.invoiceNumber ?? ""),
    createdAt: String(data.createdAt ?? new Date().toISOString()),
  };
}

export async function fetchSales(): Promise<Sale[]> {
  const db = getFirebaseDb();
  const q = query(collection(db, SALES_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => mapSale(item.id, item.data()));
}

export async function createSale(
  items: SaleItem[],
  invoiceNumber: string
): Promise<string> {
  const totalRevenue = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalCost = items.reduce((sum, item) => sum + item.lineCost, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const createdAt = new Date().toISOString();

  for (const item of items) {
    await decrementStock(item.productId, item.quantity);
  }

  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, SALES_COLLECTION), {
    items,
    totalRevenue,
    totalCost,
    totalItems,
    invoiceNumber,
    createdAt,
  });

  return docRef.id;
}
