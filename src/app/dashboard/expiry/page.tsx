"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ExpiryAlertsPage() {
  const { medicines } = useStore();

  // For the sake of the demo, let's just show all medicines with simulated expiry tags
  const getExpiryTag = (status: string, expiry: string) => {
    if (status === 'Expired' || expiry.includes("2025")) {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-none font-medium">Expired / Critical</Badge>;
    } else if (expiry.includes("Jul 2026")) {
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-none font-medium">Expires in 30 days</Badge>;
    } else {
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none font-medium">Safe</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Expiry Alerts
        </h1>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
          <Calendar className="h-4 w-4" />
          Filter by Date
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="w-[300px] text-slate-600 font-medium">Name</TableHead>
              <TableHead className="text-slate-600 font-medium">Batch No.</TableHead>
              <TableHead className="text-slate-600 font-medium">Expiry Date</TableHead>
              <TableHead className="text-right text-slate-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((item) => (
              <TableRow key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-900">
                  {item.name}
                  <div className="text-xs text-slate-500 font-normal mt-0.5">Supplier: {item.supplier}</div>
                </TableCell>
                <TableCell className="text-slate-600 font-mono text-sm">{item.batch || "N/A"}</TableCell>
                <TableCell>
                  <span className="text-slate-900 font-medium">{item.expiry}</span>
                </TableCell>
                <TableCell className="text-right">
                  {getExpiryTag(item.status, item.expiry)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
