"use client";

import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Calendar className="h-4 w-4" />
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="flex-1">
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Calendar className="h-4 w-4" />
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  );
}
