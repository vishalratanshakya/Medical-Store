"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  gradient: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:scale-[1.02]",
        `bg-gradient-to-br ${gradient}`
      )}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-white/70">{subtitle}</p>
          )}
        </div>
        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}
