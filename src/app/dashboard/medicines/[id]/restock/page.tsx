"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PackagePlus, AlertCircle } from "lucide-react";
import { useStore, Medicine } from "@/store/useStore";

export default function RestockMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { medicines, updateMedicine } = useStore();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  
  // allow empty string for backspacing
  const [addQty, setAddQty] = useState<number | "">("");

  useEffect(() => {
    const found = medicines.find(m => m.id === id);
    if (found) {
      setMedicine(found);
    }
  }, [id, medicines]);

  const handleConfirm = () => {
    if (!medicine || addQty === "" || addQty <= 0) return;
    
    const newQty = medicine.qty + Number(addQty);
    const newStatus = newQty === 0 ? 'Out of stock' : (newQty <= medicine.threshold ? 'Low stock' : 'In stock');
    
    updateMedicine(id, {
      ...medicine,
      qty: newQty,
      status: newStatus
    });
    
    router.push('/dashboard/low-stock');
  };

  if (!medicine) return null;

  const currentQty = medicine.qty;
  const newStockLevel = currentQty + (Number(addQty) || 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-500 hover:text-slate-900 bg-white border border-slate-200" 
          onClick={() => router.push('/dashboard/low-stock')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Restock Medicine
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Read-Only Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <PackagePlus className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{medicine.name}</h2>
              <p className="text-sm text-slate-500">{medicine.category}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-4 pt-2">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Quantity</p>
              <p className="text-xl font-bold text-slate-900">{medicine.qty}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Threshold</p>
              <p className="text-lg font-semibold text-slate-700">{medicine.threshold}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Print Rate</p>
              <p className="text-lg font-semibold text-slate-700">₹{medicine.mrp}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Sell Rate</p>
              <p className="text-lg font-semibold text-teal-600">₹{medicine.price}</p>
            </div>
          </div>
        </div>

        {/* Interactive Restock Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Update Inventory</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="addQty" className="text-slate-700">Quantity to add</Label>
              <Input 
                id="addQty" 
                type="number" 
                min="1"
                placeholder="0"
                value={addQty} 
                onChange={e => setAddQty(e.target.value === "" ? "" : Number(e.target.value))} 
                className="bg-white border border-slate-300 text-slate-900 h-12 px-3 text-lg focus-visible:ring-teal-500" 
              />
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  New stock level: <span className="text-teal-600 font-bold">{newStockLevel}</span> units
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {newStockLevel > medicine.threshold 
                    ? "This item will be removed from the Low Stock Alerts." 
                    : "This item will still be below the minimum threshold."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/low-stock')} 
              className="border-slate-200 text-slate-700 hover:bg-slate-50 px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="bg-teal-600 hover:bg-teal-700 text-white px-6"
              disabled={addQty === "" || addQty <= 0}
            >
              Confirm Restock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
