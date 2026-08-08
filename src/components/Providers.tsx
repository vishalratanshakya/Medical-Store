"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SmartDataProvider } from "@/context/SmartDataContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SmartDataProvider>{children}</SmartDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
