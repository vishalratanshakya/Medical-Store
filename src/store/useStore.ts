import { create } from 'zustand';

export interface Medicine {
  id: string;
  name: string;
  qty: number;
  mrp: number;
  price: number;
  threshold: number;
  batch: string;
  expiry: string;
  category: string;
  supplier: string;
  status: 'In stock' | 'Low stock' | 'Out of stock' | 'Expired';
}

export interface Category {
  id: string;
  name: string;
  count: number;
  description?: string;
  color?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  location: string;
}

export interface Sale {
  id: string;
  items: { medicineId: string; name: string; qty: number; price: number; total: number }[];
  mrpTotal: number;
  discount: number;
  payable: number;
  date: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

interface StoreState {
  medicines: Medicine[];
  categories: Category[];
  suppliers: Supplier[];
  sales: Sale[];
  auditLogs: AuditLog[];
  
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, updatedMedicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updatedFields: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addSupplier: (supplier: Supplier) => void;
  
  completeSale: (sale: Sale) => void;
  
  addAuditLog: (action: string, details: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  medicines: [
    { id: '1', name: "Paracetamol 500mg", qty: 128, mrp: 30, price: 25, threshold: 20, batch: "PM102", expiry: "12 Dec 2027", category: "Medicines", supplier: "Cipla", status: "In stock" },
    { id: '2', name: "Azithromycin 250mg", qty: 8, mrp: 85, price: 72, threshold: 10, batch: "AZ250", expiry: "15 Jan 2026", category: "Medicines", supplier: "Sun Pharma", status: "Low stock" },
    { id: '3', name: "Cough Syrup 100ml", qty: 40, mrp: 110, price: 95, threshold: 10, batch: "CS95", expiry: "22 Oct 2026", category: "Medicines", supplier: "Dabur", status: "In stock" },
    { id: '4', name: "Lakme Lipstick Ruby", qty: 15, mrp: 550, price: 480, threshold: 5, batch: "LK88", expiry: "05 Nov 2028", category: "Cosmetics", supplier: "Lakme", status: "In stock" },
    { id: '5', name: "Nivea Face Cream", qty: 3, mrp: 299, price: 259, threshold: 5, batch: "NV40", expiry: "14 Aug 2027", category: "Cosmetics", supplier: "Nivea", status: "Low stock" },
    { id: '6', name: "Colgate Toothpaste 200g", qty: 60, mrp: 150, price: 128, threshold: 15, batch: "CG50", expiry: "10 Oct 2027", category: "Personal Care", supplier: "Colgate", status: "In stock" },
    { id: '7', name: "Vitamin C Tablets", qty: 25, mrp: 450, price: 399, threshold: 10, batch: "VT99", expiry: "02 Jul 2026", category: "Supplements", supplier: "HealthKart", status: "In stock" },
    { id: '8', name: "Whey Protein 1kg", qty: 6, mrp: 2499, price: 2199, threshold: 10, batch: "WP100", expiry: "18 Jun 2026", category: "Supplements", supplier: "MuscleBlaze", status: "Low stock" },
    { id: '9', name: "Baby Diapers M-30", qty: 18, mrp: 600, price: 529, threshold: 5, batch: "DP30", expiry: "12 Dec 2029", category: "Baby Care", supplier: "Pampers", status: "In stock" },
    { id: '10', name: "Band-Aid Fabric Pack", qty: 150, mrp: 50, price: 40, threshold: 20, batch: "BA20", expiry: "01 Jan 2030", category: "First Aid", supplier: "Johnson & Johnson", status: "In stock" },
    { id: '11', name: "ORS Powder Sachet", qty: 140, mrp: 25, price: 20, threshold: 30, batch: "ORS5", expiry: "05 Mar 2027", category: "First Aid", supplier: "Wockhardt", status: "In stock" },
    { id: '12', name: "Dettol Handwash 250ml", qty: 0, mrp: 99, price: 79, threshold: 10, batch: "DT01", expiry: "14 Jul 2026", category: "Personal Care", supplier: "Dettol", status: "Out of stock" },
  ],
  categories: [
    { id: '1', name: "Medicines", count: 3 },
    { id: '2', name: "Cosmetics", count: 2 },
    { id: '3', name: "Personal Care", count: 2 },
    { id: '4', name: "Supplements", count: 2 },
    { id: '5', name: "Baby Care", count: 1 },
    { id: '6', name: "First Aid", count: 2 },
  ],
  suppliers: [
    { id: '1', name: "Cipla Ltd", phone: "+91 98765 43210", location: "Mumbai" },
    { id: '2', name: "Sun Pharmaceutical Industries", phone: "+91 91234 56780", location: "Gujarat" },
    { id: '3', name: "Dabur India Ltd", phone: "+91 92234 56781", location: "New Delhi" },
  ],
  sales: [
    {
      id: 'sale_1',
      items: [
        { medicineId: '11', name: 'ORS Powder Sachet', qty: 1, price: 20, total: 20 },
        { medicineId: '1', name: 'Paracetamol 500mg', qty: 1, price: 25, total: 25 }
      ],
      mrpTotal: 55,
      discount: 10,
      payable: 45,
      date: new Date().toISOString()
    }
  ],
  auditLogs: [
    { id: 'log1', action: "System Started", details: "Initial mock data loaded.", timestamp: new Date().toISOString(), user: "System" }
  ],

  addAuditLog: (action, details) => set((state) => ({
    auditLogs: [{ id: Math.random().toString(36).substr(2, 9), action, details, timestamp: new Date().toISOString(), user: "Admin User" }, ...state.auditLogs]
  })),

  addMedicine: (medicine) => set((state) => {
    state.addAuditLog("Added Medicine", `Added new medicine: ${medicine.name} (Qty: ${medicine.qty})`);
    return { medicines: [...state.medicines, medicine] };
  }),
  
  updateMedicine: (id, updatedFields) => set((state) => {
    const med = state.medicines.find(m => m.id === id);
    if (med) {
      state.addAuditLog("Updated Medicine", `Updated details for: ${med.name}`);
    }
    return {
      medicines: state.medicines.map((m) => {
        if (m.id === id) {
          const updatedMed = { ...m, ...updatedFields };
          if (updatedMed.qty === 0) updatedMed.status = 'Out of stock';
          else if (updatedMed.qty <= updatedMed.threshold) updatedMed.status = 'Low stock';
          else updatedMed.status = 'In stock';
          return updatedMed;
        }
        return m;
      })
    };
  }),

  deleteMedicine: (id) => set((state) => {
    const med = state.medicines.find(m => m.id === id);
    if (med) {
      state.addAuditLog("Deleted Medicine", `Removed medicine from inventory: ${med.name}`);
    }
    return {
      medicines: state.medicines.filter((m) => m.id !== id)
    };
  }),

  addCategory: (category) => set((state) => {
    state.addAuditLog("Added Category", `Created new category: ${category.name}`);
    return { categories: [...state.categories, category] };
  }),
  
  updateCategory: (id, updatedFields) => set((state) => {
    const cat = state.categories.find(c => c.id === id);
    if (cat) {
      state.addAuditLog("Updated Category", `Updated details for category: ${cat.name}`);
    }
    return {
      categories: state.categories.map((c) => c.id === id ? { ...c, ...updatedFields } : c)
    };
  }),

  deleteCategory: (id) => set((state) => {
    const cat = state.categories.find(c => c.id === id);
    if (cat) {
      state.addAuditLog("Deleted Category", `Removed category: ${cat.name}`);
    }
    return {
      categories: state.categories.filter((c) => c.id !== id)
    };
  }),
  
  addSupplier: (supplier) => set((state) => {
    state.addAuditLog("Added Supplier", `Created new supplier: ${supplier.name}`);
    return { suppliers: [...state.suppliers, supplier] };
  }),

  completeSale: (sale) => set((state) => {
    state.addAuditLog("Completed Sale", `Processed sale of ₹${sale.payable} for ${sale.items.length} items`);
    const updatedMedicines = state.medicines.map(med => {
      const saleItem = sale.items.find(i => i.medicineId === med.id);
      if (saleItem) {
        const newQty = med.qty - saleItem.qty;
        return {
          ...med,
          qty: newQty,
          status: (newQty === 0 ? 'Out of stock' : (newQty <= med.threshold ? 'Low stock' : 'In stock')) as Medicine['status']
        };
      }
      return med;
    });

    return {
      sales: [...state.sales, sale],
      medicines: updatedMedicines
    };
  })
}));
