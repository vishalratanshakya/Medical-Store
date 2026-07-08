"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Truck, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore, Supplier } from "@/store/useStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SuppliersPage() {
  const { suppliers, addSupplier } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Supplier>>({ name: "", phone: "", location: "" });

  const handleSave = () => {
    if (!formData.name) return;
    
    addSupplier({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      phone: formData.phone || "N/A",
      location: formData.location || "N/A"
    });
    setFormData({ name: "", phone: "", location: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Suppliers
        </h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" />}>
            <Plus className="h-4 w-4" />
            Add Supplier
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700">Supplier Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. MedLine Pharma"
                  className="bg-slate-50 border-slate-200 text-slate-900" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-slate-700">Contact Number</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  placeholder="e.g. +91 98765 43210"
                  className="bg-slate-50 border-slate-200 text-slate-900" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location" className="text-slate-700">Location</Label>
                <Input 
                  id="location" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  placeholder="e.g. Delhi, India"
                  className="bg-slate-50 border-slate-200 text-slate-900" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-200 text-slate-700 hover:bg-slate-50">Cancel</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Save Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="w-[300px] text-slate-600 font-medium">Supplier Name</TableHead>
              <TableHead className="text-slate-600 font-medium">Contact Details</TableHead>
              <TableHead className="text-slate-600 font-medium">Location</TableHead>
              <TableHead className="text-right text-slate-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((sup) => (
              <TableRow key={sup.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium flex items-center gap-2 text-slate-900">
                  <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  {sup.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {sup.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {sup.location}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                    Active Partner
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
