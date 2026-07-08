"use client";

import { useStore } from "@/store/useStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Receipt, ShoppingBag } from "lucide-react";

export default function SalesHistoryPage() {
  const { sales } = useStore();

  const totalSalesCount = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.payable, 0);
  const totalDiscount = sales.reduce((sum, sale) => sum + sale.discount, 0);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales History</h1>
          <p className="text-slate-500 mt-1">Review your completed store transactions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sales Value</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-slate-500 mt-1">Received revenue today</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Orders Processed</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalSalesCount}</div>
            <p className="text-xs text-slate-500 mt-1">Completed orders</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Discounts Given</CardTitle>
            <Receipt className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalDiscount)}</div>
            <p className="text-xs text-slate-500 mt-1">Promotions applied</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A list of all sales processed through MedAdmin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
                <TableHead className="text-slate-600 font-medium">Order ID</TableHead>
                <TableHead className="text-slate-600 font-medium">Date & Time</TableHead>
                <TableHead className="text-slate-600 font-medium">Items</TableHead>
                <TableHead className="text-slate-600 font-medium">Discount</TableHead>
                <TableHead className="text-slate-600 font-medium">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-12">
                    No sales recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-teal-600">#{sale.id.slice(0, 6).toUpperCase()}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(sale.date).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        {sale.items.map((item, i) => (
                          <div key={i} className="text-xs text-slate-700">
                            {item.name} <span className="text-slate-400">x{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-rose-600 text-sm">- {formatCurrency(sale.discount)}</TableCell>
                    <TableCell className="font-bold text-slate-900">{formatCurrency(sale.payable)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
