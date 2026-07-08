"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";

export default function ReportsPage() {
  const { sales, medicines } = useStore();

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.payable, 0);
  const totalDiscount = sales.reduce((acc, sale) => acc + sale.discount, 0);

  // Calculate top selling medicines from real sales data
  const itemCounts: Record<string, { name: string; units: number }> = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!itemCounts[item.medicineId]) {
        itemCounts[item.medicineId] = { name: item.name, units: 0 };
      }
      itemCounts[item.medicineId].units += item.qty;
    });
  });

  let topMedicines = Object.values(itemCounts).sort((a, b) => b.units - a.units).slice(0, 3);
  
  // Fallback to dummy data if no sales yet for UI demonstration
  if (topMedicines.length === 0) {
    topMedicines = [
      { name: "Paracetamol 500mg", units: 420 },
      { name: "Vitamin D3 60k IU", units: 265 },
      { name: "ORS sachets", units: 190 },
    ];
  }
  
  const maxUnits = Math.max(...topMedicines.map(m => m.units), 500);
  const colors = ["bg-teal-500", "bg-blue-500", "bg-purple-500"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Reports
        </h1>
        <Button variant="ghost" size="icon" className="bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white border-l-4 border-teal-500 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 mb-2 font-medium">Revenue (Today)</p>
          <p className="text-3xl font-bold text-slate-900">₹{totalRevenue}</p>
        </div>
        <div className="bg-white border-l-4 border-purple-500 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 mb-2 font-medium">Discount given (Today)</p>
          <p className="text-3xl font-bold text-slate-900">₹{totalDiscount}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-500 mb-6">
          Top selling medicines
        </h2>
        
        <div className="space-y-6">
          {topMedicines.map((item, index) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-900">{item.name}</span>
                <span className="text-slate-500">{item.units} units</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${colors[index % colors.length]}`}
                  style={{ width: `${Math.max((item.units / maxUnits) * 100, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
