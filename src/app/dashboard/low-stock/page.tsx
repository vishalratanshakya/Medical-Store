"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Plus, Minus, Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function RestockAlertsPage() {
  const { medicines, updateMedicine } = useStore();
  const [restockQuantities, setRestockQuantities] = useState<Record<string, number>>({});

  // Filter items that need restocking (qty <= threshold)
  const restockItems = medicines
    .filter(m => m.qty <= m.threshold)
    .sort((a, b) => a.qty - b.qty);

  const outOfStockCount = medicines.filter(m => m.qty === 0).length;
  const lowStockCount = medicines.filter(m => m.qty > 0 && m.qty <= m.threshold).length;
  const totalToReorder = restockItems.length;

  const handleQtyChange = (id: string, val: number) => {
    if (val < 1) return;
    setRestockQuantities(prev => ({ ...prev, [id]: val }));
  };

  const handleRestock = (id: string, currentQty: number, medName: string) => {
    const qtyToAdd = restockQuantities[id] || 0;
    if (qtyToAdd <= 0) {
      toast.error("Please specify a quantity to add");
      return;
    }

    updateMedicine(id, { qty: currentQty + qtyToAdd });
    toast.success(`Successfully restocked ${qtyToAdd} units of ${medName}`);
    
    // Clear input
    setRestockQuantities(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Restock Alerts</h1>
          <p className="text-slate-500 mt-1">Manage your medical store inventory</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow-sm shadow-teal-500/20 font-medium">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Out of Stock */}
        <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white p-5 rounded-2xl border-none shadow-lg shadow-rose-500/10">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-100">OUT OF STOCK</span>
            <AlertCircle className="h-5 w-5 opacity-85" />
          </div>
          <div className="text-4xl font-black mt-2">{outOfStockCount}</div>
          <p className="text-xs text-rose-200 mt-1">Restock urgently</p>
        </div>

        {/* Low Stock */}
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 text-white p-5 rounded-2xl border-none shadow-lg shadow-orange-500/10">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-orange-100">LOW STOCK</span>
            <AlertTriangle className="h-5 w-5 opacity-85" />
          </div>
          <div className="text-4xl font-black mt-2">{lowStockCount}</div>
          <p className="text-xs text-orange-200 mt-1">&le; 10 units left</p>
        </div>

        {/* Total to Reorder */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl border-none shadow-lg shadow-blue-500/10">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-100">TOTAL TO REORDER</span>
            <Package className="h-5 w-5 opacity-85" />
          </div>
          <div className="text-4xl font-black mt-2">{totalToReorder}</div>
          <p className="text-xs text-blue-200 mt-1">Items needing action</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Quick Restock — Inline stock update</h2>
        
        {restockItems.length === 0 ? (
          <div className="bg-white border rounded-2xl py-16 flex flex-col items-center justify-center text-slate-400">
            <Package className="h-12 w-12 text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">All stock levels healthy!</p>
            <p className="text-xs mt-1">No items require restocking at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restockItems.map((item) => {
              const currentRestockQty = restockQuantities[item.id] || 0;
              const isOutOfStock = item.qty === 0;

              return (
                <div 
                  key={item.id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200 border-l-4 ${
                    isOutOfStock ? "border-l-rose-500 border-rose-100" : "border-l-amber-500 border-amber-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{item.supplier} &bull; {item.category}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                        <span className="text-sm text-teal-600 font-extrabold">₹{item.price}</span>
                      </div>
                    </div>

                    <Badge className={
                      isOutOfStock 
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200 font-semibold" 
                        : "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200 font-semibold"
                    }>
                      {isOutOfStock ? "Out of stock" : `Low (${item.qty})`}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {/* Inline counter */}
                    <div className="flex items-center gap-1 bg-slate-50 border rounded-lg p-0.5 w-fit">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md" 
                        onClick={() => handleQtyChange(item.id, currentRestockQty - 1)}
                        disabled={currentRestockQty <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input 
                        type="number" 
                        placeholder="Add qty"
                        value={currentRestockQty || ""} 
                        onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-center bg-transparent border-0 p-0 text-xs font-bold focus-visible:ring-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md" 
                        onClick={() => handleQtyChange(item.id, currentRestockQty + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button 
                      onClick={() => handleRestock(item.id, item.qty, item.name)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-9 text-xs px-4 rounded-lg flex items-center gap-1.5 shadow-sm shadow-emerald-500/10"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
