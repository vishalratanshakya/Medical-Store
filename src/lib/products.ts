import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Product, ProductFormData } from "@/types";

const PRODUCTS_COLLECTION = "products";
const LOCAL_STORAGE_KEY = "medical-store-products-local";

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: String(data.name ?? ""),
    category: data.category as Product["category"],
    mrpRate: Number(data.mrpRate ?? 0),
    sellingRate: Number(data.sellingRate ?? 0),
    stockQuantity: Number(data.stockQuantity ?? 0),
    expiryDate: String(data.expiryDate ?? ""),
    batchNumber: String(data.batchNumber ?? ""),
    imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  };
}

const DUMMY_PRODUCTS: Product[] = [
  // Medicines
  {
    id: "local-med-1",
    name: "Paracetamol 500mg",
    category: "medicines",
    mrpRate: 40,
    sellingRate: 35,
    stockQuantity: 120,
    expiryDate: "2027-12-31",
    batchNumber: "PM12345",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-med-2",
    name: "Amoxicillin 250mg",
    category: "medicines",
    mrpRate: 150,
    sellingRate: 130,
    stockQuantity: 8,
    expiryDate: "2026-06-30",
    batchNumber: "AM67890",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-med-3",
    name: "Metformin 500mg",
    category: "medicines",
    mrpRate: 90,
    sellingRate: 80,
    stockQuantity: 200,
    expiryDate: "2028-03-15",
    batchNumber: "MF54321",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Syrups
  {
    id: "local-syr-1",
    name: "Cough Syrup (Guaifenesin)",
    category: "syrups",
    mrpRate: 120,
    sellingRate: 110,
    stockQuantity: 45,
    expiryDate: "2026-11-30",
    batchNumber: "CS8877",
    imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=120&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-syr-2",
    name: "Paracetamol Pediatric Suspension",
    category: "syrups",
    mrpRate: 65,
    sellingRate: 58,
    stockQuantity: 5,
    expiryDate: "2026-05-15",
    batchNumber: "PP9988",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-syr-3",
    name: "Multivitamin Syrup",
    category: "syrups",
    mrpRate: 180,
    sellingRate: 160,
    stockQuantity: 30,
    expiryDate: "2027-01-10",
    batchNumber: "MV1122",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Tubes
  {
    id: "local-tub-1",
    name: "Betadine Ointment 20g",
    category: "tubes",
    mrpRate: 85,
    sellingRate: 75,
    stockQuantity: 60,
    expiryDate: "2027-08-31",
    batchNumber: "BO4433",
    imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8f304b3b8a?w=120&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-tub-2",
    name: "Hydrocortisone Cream 1%",
    category: "tubes",
    mrpRate: 110,
    sellingRate: 95,
    stockQuantity: 3,
    expiryDate: "2026-04-20",
    batchNumber: "HC6655",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-tub-3",
    name: "Diclofenac Gel 30g",
    category: "tubes",
    mrpRate: 95,
    sellingRate: 85,
    stockQuantity: 40,
    expiryDate: "2027-05-15",
    batchNumber: "DG2211",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Cosmetics
  {
    id: "local-cos-1",
    name: "Moisturizing Face Wash",
    category: "cosmetics",
    mrpRate: 250,
    sellingRate: 220,
    stockQuantity: 25,
    expiryDate: "2027-09-30",
    batchNumber: "FW5544",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-cos-2",
    name: "Aloe Vera Soothing Gel",
    category: "cosmetics",
    mrpRate: 199,
    sellingRate: 175,
    stockQuantity: 15,
    expiryDate: "2027-10-15",
    batchNumber: "AV6677",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-cos-3",
    name: "Sunscreen SPF 50+",
    category: "cosmetics",
    mrpRate: 450,
    sellingRate: 399,
    stockQuantity: 8,
    expiryDate: "2027-04-30",
    batchNumber: "SS7788",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Drips
  {
    id: "local-drp-1",
    name: "Normal Saline (NS) 0.9% 500ml",
    category: "drips",
    mrpRate: 50,
    sellingRate: 45,
    stockQuantity: 150,
    expiryDate: "2028-06-30",
    batchNumber: "NS3322",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-drp-2",
    name: "Dextrose 5% 500ml",
    category: "drips",
    mrpRate: 55,
    sellingRate: 48,
    stockQuantity: 4,
    expiryDate: "2027-01-31",
    batchNumber: "D51122",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-drp-3",
    name: "Ringer's Lactate (RL) 500ml",
    category: "drips",
    mrpRate: 60,
    sellingRate: 52,
    stockQuantity: 80,
    expiryDate: "2028-09-30",
    batchNumber: "RL9900",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Additional testing products for pagination (total > 20)
  {
    id: "local-med-4",
    name: "Ibuprofen 400mg",
    category: "medicines",
    mrpRate: 50,
    sellingRate: 42,
    stockQuantity: 15,
    expiryDate: "2027-10-31",
    batchNumber: "IB88776",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-med-5",
    name: "Ciprofloxacin 500mg",
    category: "medicines",
    mrpRate: 180,
    sellingRate: 160,
    stockQuantity: 7,
    expiryDate: "2026-08-31",
    batchNumber: "CP55443",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-med-6",
    name: "Atorvastatin 10mg",
    category: "medicines",
    mrpRate: 120,
    sellingRate: 105,
    stockQuantity: 9,
    expiryDate: "2027-02-28",
    batchNumber: "AT33221",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-syr-4",
    name: "Cetirizine Antihistamine Syrup",
    category: "syrups",
    mrpRate: 95,
    sellingRate: 85,
    stockQuantity: 3,
    expiryDate: "2026-07-15",
    batchNumber: "CA11223",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-syr-5",
    name: "B-Complex Vitamin Syrup",
    category: "syrups",
    mrpRate: 140,
    sellingRate: 125,
    stockQuantity: 25,
    expiryDate: "2027-09-30",
    batchNumber: "BC44556",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-syr-6",
    name: "Zinc Supplement Drops",
    category: "syrups",
    mrpRate: 80,
    sellingRate: 70,
    stockQuantity: 6,
    expiryDate: "2026-09-10",
    batchNumber: "ZS99887",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-tub-4",
    name: "Clotrimazole Anti-Fungal Cream",
    category: "tubes",
    mrpRate: 75,
    sellingRate: 65,
    stockQuantity: 5,
    expiryDate: "2026-12-31",
    batchNumber: "CZ77889",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-tub-5",
    name: "Mupirocin Ointment 2% 5g",
    category: "tubes",
    mrpRate: 130,
    sellingRate: 115,
    stockQuantity: 18,
    expiryDate: "2027-05-30",
    batchNumber: "MP44556",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-cos-4",
    name: "Vitamin C Brightening Serum",
    category: "cosmetics",
    mrpRate: 599,
    sellingRate: 499,
    stockQuantity: 2,
    expiryDate: "2027-03-31",
    batchNumber: "VC55667",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-cos-5",
    name: "Salicylic Acid Daily Cleanser",
    category: "cosmetics",
    mrpRate: 350,
    sellingRate: 310,
    stockQuantity: 22,
    expiryDate: "2027-11-30",
    batchNumber: "SA11223",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-drp-4",
    name: "Mannitol Infusion 20% 350ml",
    category: "drips",
    mrpRate: 85,
    sellingRate: 75,
    stockQuantity: 8,
    expiryDate: "2027-04-15",
    batchNumber: "MN55667",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "local-drp-5",
    name: "Metronidazole IV 100ml",
    category: "drips",
    mrpRate: 45,
    sellingRate: 38,
    stockQuantity: 30,
    expiryDate: "2028-02-28",
    batchNumber: "MZ99887",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

function getLocalProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DUMMY_PRODUCTS));
    return DUMMY_PRODUCTS;
  }
  return JSON.parse(stored);
}

function saveLocalProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const db = getFirebaseDb();
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((item) => mapProduct(item.id, item.data()));
    
    // Auto-seed if Firebase returns empty array
    if (docs.length === 0) {
      console.log("Firestore database is empty. Auto-seeding sample products...");
      await seedSampleProducts();
      const newSnapshot = await getDocs(q);
      return newSnapshot.docs.map((item) => mapProduct(item.id, item.data()));
    }
    
    return docs;
  } catch (error) {
    console.warn("Firebase fetch error, falling back to localStorage:", error);
    return getLocalProducts();
  }
}

export async function createProduct(data: ProductFormData): Promise<string> {
  const now = new Date().toISOString();
  try {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.warn("Firebase create error, falling back to localStorage:", error);
    const local = getLocalProducts();
    const newId = `local-prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    local.push(newProduct);
    saveLocalProducts(local);
    return newId;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<void> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Firebase update error, falling back to localStorage:", error);
    const local = getLocalProducts();
    const idx = local.findIndex((p) => p.id === id);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveLocalProducts(local);
    }
  }
}

export async function restockProduct(
  id: string,
  additionalQuantity: number,
  batchNumber?: string,
  expiryDate?: string
): Promise<void> {
  // Always update local storage first to sync client-side cache immediately
  const local = getLocalProducts();
  const idx = local.findIndex((p) => p.id === id);
  let updatedStock = additionalQuantity;

  if (idx !== -1) {
    local[idx].stockQuantity += additionalQuantity;
    updatedStock = local[idx].stockQuantity;
    if (batchNumber) local[idx].batchNumber = batchNumber;
    if (expiryDate) local[idx].expiryDate = expiryDate;
    local[idx].updatedAt = new Date().toISOString();
    saveLocalProducts(local);
  }

  if (!id.startsWith("local-")) {
    try {
      const db = getFirebaseDb();
      const updateData: Record<string, any> = {
        stockQuantity: updatedStock,
        updatedAt: new Date().toISOString(),
      };
      if (batchNumber) updateData.batchNumber = batchNumber;
      if (expiryDate) updateData.expiryDate = expiryDate;

      await updateDoc(doc(db, PRODUCTS_COLLECTION, id), updateData);
    } catch (error) {
      console.warn("Firebase restock error:", error);
    }
  }
}

export async function deleteProduct(id: string): Promise<void> {
  // Always update local storage first to keep local cache in sync immediately
  const local = getLocalProducts();
  const filtered = local.filter((p) => p.id !== id);
  saveLocalProducts(filtered);

  if (!id.startsWith("local-")) {
    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    } catch (error) {
      console.warn("Firebase delete error:", error);
    }
  }
}

export async function decrementStock(
  productId: string,
  quantity: number
): Promise<void> {
  try {
    const products = await fetchProducts();
    const product = products.find((item) => item.id === productId);
    if (!product) throw new Error("Product not found");
    if (product.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const db = getFirebaseDb();
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
      stockQuantity: product.stockQuantity - quantity,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Firebase decrement error, falling back to localStorage:", error);
    const local = getLocalProducts();
    const idx = local.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      if (local[idx].stockQuantity < quantity) {
        throw new Error(`Insufficient stock for ${local[idx].name}`);
      }
      local[idx].stockQuantity -= quantity;
      local[idx].updatedAt = new Date().toISOString();
      saveLocalProducts(local);
    }
  }
}

export async function seedSampleProducts(): Promise<void> {
  const sampleProducts: ProductFormData[] = [
    // Medicines
    {
      name: "Paracetamol 500mg",
      category: "medicines",
      mrpRate: 40,
      sellingRate: 35,
      stockQuantity: 120,
      expiryDate: "2027-12-31",
      batchNumber: "PM12345",
    },
    {
      name: "Amoxicillin 250mg",
      category: "medicines",
      mrpRate: 150,
      sellingRate: 130,
      stockQuantity: 8,
      expiryDate: "2026-06-30",
      batchNumber: "AM67890",
    },
    {
      name: "Metformin 500mg",
      category: "medicines",
      mrpRate: 90,
      sellingRate: 80,
      stockQuantity: 200,
      expiryDate: "2028-03-15",
      batchNumber: "MF54321",
    },
    // Syrups
    {
      name: "Cough Syrup (Guaifenesin)",
      category: "syrups",
      mrpRate: 120,
      sellingRate: 110,
      stockQuantity: 45,
      expiryDate: "2026-11-30",
      batchNumber: "CS8877",
    },
    {
      name: "Paracetamol Pediatric Suspension",
      category: "syrups",
      mrpRate: 65,
      sellingRate: 58,
      stockQuantity: 5,
      expiryDate: "2026-05-15",
      batchNumber: "PP9988",
    },
    {
      name: "Multivitamin Syrup",
      category: "syrups",
      mrpRate: 180,
      sellingRate: 160,
      stockQuantity: 30,
      expiryDate: "2027-01-10",
      batchNumber: "MV1122",
    },
    // Tubes
    {
      name: "Betadine Ointment 20g",
      category: "tubes",
      mrpRate: 85,
      sellingRate: 75,
      stockQuantity: 60,
      expiryDate: "2027-08-31",
      batchNumber: "BO4433",
    },
    {
      name: "Hydrocortisone Cream 1%",
      category: "tubes",
      mrpRate: 110,
      sellingRate: 95,
      stockQuantity: 3,
      expiryDate: "2026-04-20",
      batchNumber: "HC6655",
    },
    {
      name: "Diclofenac Gel 30g",
      category: "tubes",
      mrpRate: 95,
      sellingRate: 85,
      stockQuantity: 40,
      expiryDate: "2027-05-15",
      batchNumber: "DG2211",
    },
    // Cosmetics
    {
      name: "Moisturizing Face Wash",
      category: "cosmetics",
      mrpRate: 250,
      sellingRate: 220,
      stockQuantity: 25,
      expiryDate: "2027-09-30",
      batchNumber: "FW5544",
    },
    {
      name: "Aloe Vera Soothing Gel",
      category: "cosmetics",
      mrpRate: 199,
      sellingRate: 175,
      stockQuantity: 15,
      expiryDate: "2027-10-15",
      batchNumber: "AV6677",
    },
    {
      name: "Sunscreen SPF 50+",
      category: "cosmetics",
      mrpRate: 450,
      sellingRate: 399,
      stockQuantity: 8,
      expiryDate: "2027-04-30",
      batchNumber: "SS7788",
    },
    // Drips
    {
      name: "Normal Saline (NS) 0.9% 500ml",
      category: "drips",
      mrpRate: 50,
      sellingRate: 45,
      stockQuantity: 150,
      expiryDate: "2028-06-30",
      batchNumber: "NS3322",
    },
    {
      name: "Dextrose 5% 500ml",
      category: "drips",
      mrpRate: 55,
      sellingRate: 48,
      stockQuantity: 4,
      expiryDate: "2027-01-31",
      batchNumber: "D51122",
    },
    {
      name: "Ringer's Lactate (RL) 500ml",
      category: "drips",
      mrpRate: 60,
      sellingRate: 52,
      stockQuantity: 80,
      expiryDate: "2028-09-30",
      batchNumber: "RL9900",
    },
  ];

  for (const product of sampleProducts) {
    try {
      const db = getFirebaseDb();
      const now = new Date().toISOString();
      await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...product,
        createdAt: now,
        updatedAt: now,
      });
    } catch {
      // If seeding Firestore fails, it will fall back to local storage automatically
    }
  }

  // Also seed local storage to keep them in sync
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(
      sampleProducts.map((p, idx) => ({
        id: `local-seeded-${idx}-${Date.now()}`,
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    ));
  }
}

export { Timestamp };
