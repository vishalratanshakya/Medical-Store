"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSmartData } from "@/context/SmartDataContext";
import { Menu, Cross } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isDemoMode } = useSmartData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      {/* Mobile Top Navbar */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <Cross className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">Medical Store</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Backdrop for mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-35 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar with mobile drawer state */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="ml-0 lg:ml-64 min-h-screen p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
