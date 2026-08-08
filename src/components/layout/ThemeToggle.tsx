"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5" />
          Dark Mode
        </>
      ) : (
        <>
          <Sun className="h-5 w-5" />
          Light Mode
        </>
      )}
    </button>
  );
}
