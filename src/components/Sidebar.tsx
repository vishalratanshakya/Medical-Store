"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  History,
  AlertTriangle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/medicines", icon: Pill },
  { name: "Sales / POS", href: "/dashboard/billing", icon: ShoppingCart },
  { name: "Sales History", href: "/dashboard/sales", icon: History },
  { name: "Restock Alerts", href: "/dashboard/low-stock", icon: AlertTriangle },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col justify-between",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <div className="flex items-center gap-2 font-bold text-xl text-teal-600">
              <div className="h-9 w-9 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-teal-500/30">
                <Pill className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-bold text-base leading-tight">MediStore</span>
                <span className="text-slate-400 text-xs font-normal">Admin Dashboard</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
              <Pill className="h-5 w-5" />
            </Button>
          </div>

          <nav className="p-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group overflow-hidden",
                    isActive 
                      ? "text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md shadow-teal-500/20" 
                      : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-5 w-5 relative z-10 transition-all duration-300", 
                      isActive ? "text-white scale-110" : "text-slate-400 group-hover:scale-110 group-hover:text-teal-500"
                    )} 
                  />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Logout and User Profile */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </Link>

          <div className="bg-[#0f172a] text-white p-3.5 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Store Owner</span>
              <span className="font-bold text-sm tracking-tight">Admin Panel</span>
              <span className="text-slate-300 text-xs mt-1">N - MVP</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 text-sm shadow-inner">
              N
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
