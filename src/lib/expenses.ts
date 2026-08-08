import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export interface Expense {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  cost: number;
  createdAt: string;
}

const EXPENSES_COLLECTION = "expenses";

export async function fetchExpenses(): Promise<Expense[]> {
  try {
    const db = getFirebaseDb();
    const q = query(collection(db, EXPENSES_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        productId: String(data.productId ?? ""),
        productName: String(data.productName ?? ""),
        quantity: Number(data.quantity ?? 0),
        cost: Number(data.cost ?? 0),
        createdAt: String(data.createdAt ?? new Date().toISOString()),
      };
    });
  } catch (error) {
    console.warn("Firebase fetch expenses error:", error);
    return [];
  }
}

export async function createExpense(expense: Omit<Expense, "id" | "createdAt">): Promise<string> {
  const db = getFirebaseDb();
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
    ...expense,
    createdAt,
  });
  return docRef.id;
}
