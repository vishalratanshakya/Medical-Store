"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Badge } from "@/components/ui/badge";

export default function AuditLogsPage() {
  const { auditLogs } = useStore();

  const getActionBadge = (action: string) => {
    if (action.includes("Added")) {
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none font-medium">{action}</Badge>;
    } else if (action.includes("Updated")) {
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none shadow-none font-medium">{action}</Badge>;
    } else if (action.includes("Deleted")) {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-none font-medium">{action}</Badge>;
    } else if (action.includes("Sale")) {
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none shadow-none font-medium">{action}</Badge>;
    }
    return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-none font-medium">{action}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Audit Logs
        </h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="w-[200px] text-slate-600 font-medium">Timestamp</TableHead>
              <TableHead className="w-[150px] text-slate-600 font-medium">Action</TableHead>
              <TableHead className="text-slate-600 font-medium">Details</TableHead>
              <TableHead className="w-[150px] text-right text-slate-600 font-medium">User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <TableCell className="text-slate-500 font-mono text-xs">
                  {formatDate(log.timestamp)}
                </TableCell>
                <TableCell>
                  {getActionBadge(log.action)}
                </TableCell>
                <TableCell className="text-slate-900 font-medium">
                  {log.details}
                </TableCell>
                <TableCell className="text-right text-slate-600">
                  <div className="flex items-center justify-end gap-2">
                    <ClipboardList className="h-4 w-4 text-slate-400" />
                    {log.user}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {auditLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
