"use client";

import { Report } from "@/store/api/moderationApi";
import { GetReportsParams } from "@/store/api/moderationApi";
import { useGetReportsQuery, useResolveReportMutation, useDismissReportMutation } from "@/store/api/moderationApi";
import { useState } from "react";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onViewDetail: (report: Report) => void;
}

export default function ReportList({ onViewDetail }: Props) {
  const [params, setParams] = useState<GetReportsParams>({
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetReportsQuery(params);
  const [resolveReport] = useResolveReportMutation();
  const [dismissReport] = useDismissReportMutation();

  const handleFilter = (filter: keyof GetReportsParams, value: string | undefined) => {
    setParams({ ...params, [filter]: value, page: 1 });
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveReport(id).unwrap();
    } catch (error) {
      console.error("Failed to resolve report:", error);
    }
  };

  const handleDismiss = async (id: string) => {
    const reason = prompt("Enter reason for dismissing this report:");
    if (!reason) return;

    try {
      await dismissReport({ id, reason }).unwrap();
    } catch (error) {
      console.error("Failed to dismiss report:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-center text-muted-foreground">Failed to load reports</p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={params.status || "all"}
          onChange={(e) => handleFilter("status", e.target.value === "all" ? undefined : e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
        <select
          value={params.targetType || "all"}
          onChange={(e) => handleFilter("targetType", e.target.value === "all" ? undefined : e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="COMMENT">Comment</option>
          <option value="RATING">Rating</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Reporter</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((report) => (
                <tr key={report.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {report.reporter.avatar ? (
                        <img
                          src={report.reporter.avatar}
                          alt={report.reporter.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-xs font-medium">
                            {report.reporter.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm">{report.reporter.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{report.targetType}</td>
                  <td className="px-4 py-3 text-sm">{report.reason}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      report.status === "PENDING" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      report.status === "RESOLVED" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                      report.status === "DISMISSED" && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetail(report)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="View Details"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </button>
                      {report.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleResolve(report.id)}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                            title="Resolve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDismiss(report.id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                            title="Dismiss"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {((params.page || 1) - 1) * (params.limit || 10) + 1} to{" "}
              {Math.min((params.page || 1) * (params.limit || 10), data.total)} of {data.total} reports
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange((params.page || 1) - 1)}
                disabled={(params.page || 1) === 1}
                className="p-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm">
                Page {params.page || 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange((params.page || 1) + 1)}
                disabled={(params.page || 1) === totalPages}
                className="p-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
