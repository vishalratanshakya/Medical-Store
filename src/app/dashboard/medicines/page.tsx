"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";

export default function MedicinesPage() {
  const { medicines, deleteMedicine } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In stock":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-none font-medium">In stock</Badge>;
      case "Low stock":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-none font-medium">Low stock</Badge>;
      case "Out of stock":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-none font-medium">Out of stock</Badge>;
      case "Expired":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-none font-medium">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Medicines
        </h1>
        
        <Link href="/dashboard/medicines/add">
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4" />
            Add medicine
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400 ml-2" />
        <Input 
          type="text" 
          placeholder="Search medicine by name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 px-0 text-base bg-transparent text-slate-900"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="w-[250px] text-slate-600 font-medium">Name</TableHead>
              <TableHead className="text-slate-600 font-medium">Category</TableHead>
              <TableHead className="text-slate-600 font-medium">Qty</TableHead>
              <TableHead className="text-slate-600 font-medium">Print rate</TableHead>
              <TableHead className="text-slate-600 font-medium">Sell rate</TableHead>
              <TableHead className="text-slate-600 font-medium">Status</TableHead>
              <TableHead className="text-right text-slate-600 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map((medicine) => (
              <TableRow key={medicine.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-900">
                  {medicine.name}
                </TableCell>
                <TableCell className="text-slate-500">{medicine.category}</TableCell>
                <TableCell className="text-slate-900 font-medium">{medicine.qty}</TableCell>
                <TableCell className="text-slate-500">₹{medicine.mrp}</TableCell>
                <TableCell className="text-teal-600 font-medium">₹{medicine.price}</TableCell>
                <TableCell>
                  {getStatusBadge(medicine.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/medicines/${medicine.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => deleteMedicine(medicine.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredMedicines.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                  {searchQuery ? `No medicines found matching "${searchQuery}".` : "No medicines found. Add one to get started."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
