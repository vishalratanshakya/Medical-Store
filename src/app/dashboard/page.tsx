"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, IndianRupee } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

const CATEGORY_COLORS = {
  "Medicines": "#0ea5e9", // blue
  "Cosmetics": "#ec4899", // pink
  "Personal Care": "#10b981", // green
  "Supplements": "#f59e0b", // orange
  "Baby Care": "#8b5cf6", // purple
  "First Aid": "#ef4444" // red
};

export default function DashboardPage() {
  const { medicines, sales, categories } = useStore();

  const totalMedicines = medicines.length;
  const totalUnits = medicines.reduce((acc, med) => acc + med.qty, 0);
  const lowStockItems = medicines.filter(med => med.qty <= med.threshold && med.qty > 0);
  const outOfStockItems = medicines.filter(med => med.qty === 0);

  // Dynamic calculations for sales today
  const todayDateStr = new Date().toDateString();
  const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === todayDateStr);
  const todayRevenue = todaySales.reduce((acc, sale) => acc + sale.payable, 0);
  const todayOrdersCount = todaySales.length;

  // Format currency
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  // 7-day revenue chart data matching the mockup curve
  const revenueChartData = useMemo(() => {
    const days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
    return days.map((day, idx) => {
      // Last day is today (Wed), which gets today's revenue.
      // Other days are mocked to 0 to match the mockup's flat-then-spike line.
      const value = idx === days.length - 1 ? todayRevenue : 0;
      return { name: day, revenue: value };
    });
  }, [todayRevenue]);

  // Doughnut split data
  const pieChartData = useMemo(() => {
    return categories.map(cat => {
      const count = medicines.filter(m => m.category === cat.name).length;
      return {
        name: cat.name,
        value: count,
        color: CATEGORY_COLORS[cat.name as keyof typeof CATEGORY_COLORS] || "#cbd5e1"
      };
    });
  }, [categories, medicines]);

  // Stock by category bar data
  const barChartData = useMemo(() => {
    return categories.map(cat => {
      const count = medicines.filter(m => m.category === cat.name).reduce((sum, item) => sum + item.qty, 0);
      return {
        name: cat.name,
        count,
        color: CATEGORY_COLORS[cat.name as keyof typeof CATEGORY_COLORS] || "#cbd5e1"
      };
    });
  }, [categories, medicines]);

  // Restock Needed List: sorted by qty ascending (Out of stock first, then low stock)
  const restockNeededList = useMemo(() => {
    return medicines
      .filter(m => m.qty <= m.threshold)
      .sort((a, b) => a.qty - b.qty)
      .slice(0, 4);
  }, [medicines]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Manage your medical store inventory</p>
        </div>
        <Link href="/dashboard/medicines">
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow-sm shadow-teal-500/20 font-medium">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today Revenue */}
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-5 rounded-2xl border-none shadow-lg shadow-emerald-500/10 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100">TODAY REVENUE</span>
            <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{formatCurrency(todayRevenue)}</div>
          <p className="text-xs text-emerald-100 mt-1">
            {todayOrdersCount} order{todayOrdersCount !== 1 ? 's' : ''} today
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-5 rounded-2xl border-none shadow-lg shadow-blue-500/10 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-100">TOTAL PRODUCTS</span>
            <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{totalMedicines}</div>
          <p className="text-xs text-blue-100 mt-1">
            {totalUnits} units in stock
          </p>
        </div>

        {/* Low Stock */}
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 text-white p-5 rounded-2xl border-none shadow-lg shadow-orange-500/10 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-orange-100">LOW STOCK</span>
            <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{lowStockItems.length}</div>
          <p className="text-xs text-orange-100 mt-1">
            Need restocking
          </p>
        </div>

        {/* Out of Stock */}
        <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white p-5 rounded-2xl border-none shadow-lg shadow-rose-500/10 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-100">OUT OF STOCK</span>
            <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{outOfStockItems.length}</div>
          <p className="text-xs text-rose-100 mt-1">
            Urgent action
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Revenue Overview Line Chart */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Revenue — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" dot={{ stroke: '#0d9488', strokeWidth: 2, r: 4, fill: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Split Doughnut Chart */}
        <Card className="border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-between h-[280px] pb-6">
            <div className="h-[150px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 w-full text-[10px] text-slate-500 font-medium">
              {pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Stock by Category Bar Chart */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Stock by Category</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Restock Needed List */}
        <Card className="border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow rounded-2xl flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-1.5 text-amber-600">
              <AlertTriangle className="h-4.5 w-4.5" />
              <CardTitle className="text-base font-bold text-slate-800">Restock Needed</CardTitle>
            </div>
            <Link href="/dashboard/low-stock" className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-0.5">
              <span>View all</span>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {restockNeededList.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs py-10">
                All items are in stock
              </div>
            ) : (
              <div className="space-y-2">
                {restockNeededList.map((item) => {
                  const isOutOfStock = item.qty === 0;
                  return (
                    <Link 
                      key={item.id} 
                      href="/dashboard/low-stock"
                      className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-extrabold text-slate-900 truncate group-hover:text-teal-600 transition-colors">{item.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.supplier} &bull; {item.category}</p>
                      </div>
                      <Badge className={
                        isOutOfStock 
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border-none shrink-0 font-semibold"
                          : "bg-amber-50 text-amber-600 hover:bg-amber-100 border-none shrink-0 font-semibold"
                      }>
                        {isOutOfStock ? "Out of stock" : `Low (${item.qty})`}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple placeholder helper
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
