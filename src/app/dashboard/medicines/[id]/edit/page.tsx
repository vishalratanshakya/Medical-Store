"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useStore, Medicine } from "@/store/useStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { medicines, categories, updateMedicine } = useStore();

  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: "", qty: 0, mrp: 0, price: 0, threshold: 10, batch: "", expiry: "", category: "", supplier: ""
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
      setFormData(medicine);
    }
    setLoading(false);
  }, [id, medicines]);

  const handleSave = () => {
    if (!formData.name) return;
    
    updateMedicine(id, {
      ...formData,
      qty: Number(formData.qty) || 0,
      threshold: Number(formData.threshold) || 10,
      mrp: Number(formData.mrp) || 0,
      price: Number(formData.price) || 0,
      status: (Number(formData.qty) || 0) === 0 ? 'Out of stock' : ((Number(formData.qty) || 0) <= (Number(formData.threshold) || 10) ? 'Low stock' : 'In stock')
    });
    router.push('/dashboard/medicines');
  };

  if (loading) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-500 hover:text-slate-900 bg-white border border-slate-200" 
          onClick={() => router.push('/dashboard/medicines')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Edit Medicine
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-slate-700">Name</Label>
            <Input 
              id="name" 
              value={formData.name || ""} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="bg-white border border-slate-300 text-slate-900 h-10 px-3 focus-visible:ring-teal-500" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="qty" className="text-slate-700">Quantity</Label>
              <Input 
                id="qty" 
                type="number" 
                value={formData.qty === undefined ? "" : formData.qty} 
                onChange={e => setFormData({...formData, qty: e.target.value === "" ? "" : Number(e.target.value)} as any)} 
                className="bg-white border border-slate-300 text-slate-900 h-10 px-3 focus-visible:ring-teal-500" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="threshold" className="text-slate-700">Min Threshold</Label>
              <Input 
                id="threshold" 
                type="number" 
                value={formData.threshold === undefined ? "" : formData.threshold} 
                onChange={e => setFormData({...formData, threshold: e.target.value === "" ? "" : Number(e.target.value)} as any)} 
                className="bg-white border border-slate-300 text-slate-900 h-10 px-3 focus-visible:ring-teal-500" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="mrp" className="text-slate-700">Print Rate (₹)</Label>
              <Input 
                id="mrp" 
                type="number" 
                value={formData.mrp === undefined ? "" : formData.mrp} 
                onChange={e => setFormData({...formData, mrp: e.target.value === "" ? "" : Number(e.target.value)} as any)} 
                className="bg-white border border-slate-300 text-slate-900 h-10 px-3 focus-visible:ring-teal-500" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-slate-700">Sell Rate (₹)</Label>
              <Input 
                id="price" 
                type="number" 
                value={formData.price === undefined ? "" : formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value === "" ? "" : Number(e.target.value)} as any)} 
                className="bg-white border border-slate-300 text-slate-900 h-10 px-3 focus-visible:ring-teal-500" 
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label className="text-slate-700">Category</Label>
            <Select value={formData.category || ""} onValueChange={val => setFormData({...formData, category: val || ""})}>
              <SelectTrigger className="bg-white border border-slate-300 text-slate-900 h-10 px-3 focus-visible:ring-teal-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {categories.map(c => <SelectItem key={c.id} value={c.name} className="text-slate-900 focus:bg-slate-100">{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/medicines')} 
            className="border-slate-200 text-slate-700 hover:bg-slate-50 px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-teal-600 hover:bg-teal-700 text-white px-6"
            disabled={!formData.name}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
