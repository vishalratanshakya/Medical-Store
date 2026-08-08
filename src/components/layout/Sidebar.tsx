"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Pill,
  Droplets,
  Package,
  Sparkles,
  Syringe,
  AlertTriangle,
  BarChart3,
  ShoppingCart,
  LogOut,
  Cross,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "All Products", icon: ClipboardList },
  { href: "/medicines", label: "Medicines", icon: Pill },
  { href: "/syrups", label: "Syrups", icon: Droplets },
  { href: "/tubes", label: "Face Tubes & Other Tubes", icon: Package },
  { href: "/cosmetics", label: "Cosmetics", icon: Sparkles },
  { href: "/drips", label: "Drips", icon: Syringe },
  { href: "/dashboard/restock", label: "Restock / Low Stock", icon: AlertTriangle },
  { href: "/analytics", label: "Sales & Revenue", icon: BarChart3 },
  { href: "/billing", label: "Billing / POS", icon: ShoppingCart },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const [isMobile, setIsMobile] = useState(false);

  // Monitor media queries client-side only
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const categoryParam = searchParams.get("category");

  // Auto-close on route transitions
  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <motion.aside
      initial={false}
      animate={{
        x: isMobile ? (isOpen ? 0 : "-100%") : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag={isMobile ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.1, right: 0.1 }}
      onDragEnd={(e, info) => {
        if (isMobile && info.offset.x < -50) {
          onClose();
        }
      }}
      className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 touch-pan-y"
    >
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <Cross className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white">
            Medical Store
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Admin Dashboard
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          let isActive = false;
          if (item.href === "/dashboard") {
            isActive = pathname === "/dashboard";
          } else if (item.href === "/dashboard/products") {
            isActive = pathname === "/dashboard/products" || (pathname.startsWith("/dashboard/products") && !categoryParam);
          } else if (categoryParam) {
            isActive = item.href === `/${categoryParam}` && pathname.startsWith("/dashboard/products");
          } else {
            isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          }
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-200 p-3 dark:border-gray-800">
        <ThemeToggle />
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}
