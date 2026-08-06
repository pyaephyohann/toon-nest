"use client";

import { useState } from "react";
import { Report } from "@/store/api/moderationApi";
import { useGetReportByIdQuery, useResolveReportMutation, useDismissReportMutation } from "@/store/api/moderationApi";
import { X, CheckCircle, XCircle, AlertCircle, Calendar, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  reportId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReportDetail({ reportId, onClose, onSuccess }: Props) {
  const { data: report, isLoading, error } = useGetReportByIdQuery(reportId);
  const [resolveReport, { isLoading: isResolving }] = useResolveReportMutation();
  const [dismissReport, { isLoading: isDismissing }] = useDismissReportMutation();
  const [dismissReason, setDismissReason] = useState("");

  const handleResolve = async () => {
    try {
      await resolveReport(reportId).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to resolve report:", error);
    }
  };

  const handleDismiss = async () => {
    if (!dismissReason.trim()) {
      alert("Please enter a reason for dismissing this report");
      return;
    }

    try {
      await dismissReport({ id: reportId, reason: dismissReason }).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to dismiss report:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-6">
          <p className="text-center text-muted-foreground">Failed to load report details</p>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 rounded-lg border border-border hover:bg-accent transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Report Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              report.status === "PENDING" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
              report.status === "RESOLVED" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              report.status === "DISMISSED" && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            )}>
              {report.status}
            </span>
            {report.resolvedAt && (
              <span className="text-sm text-muted-foreground">
                Resolved: {new Date(report.resolvedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Reporter Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3 mb-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <span className="font-medium">Reporter</span>
            </div>
            <div className="flex items-center gap-3">
              {report.reporter.avatar ? (
                <img
                  src={report.reporter.avatar}
                  alt={report.reporter.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-medium">
                    {report.reporter.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">{report.reporter.username}</p>
                <p className="text-sm text-muted-foreground">ID: {report.reporterId}</p>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Target Type</label>
              <p className="text-sm">{report.targetType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target ID</label>
              <p className="text-sm font-mono">{report.targetId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <p className="text-sm">{report.reason}</p>
            </div>
            {report.description && (
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <p className="text-sm">{report.description}</p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {new Date(report.createdAt).toLocaleString()}</span>
          </div>

          {/* Actions */}
          {report.status === "PENDING" && (
            <div className="space-y-3 pt-4 border-t border-border">
              <button
                onClick={handleResolve}
                disabled={isResolving}
                className={cn(
                  "w-full px-4 py-2 rounded-lg bg-green-600 text-white font-medium transition",
                  isResolving && "opacity-50 cursor-not-allowed"
                )}
              >
                {isResolving ? "Resolving..." : "Resolve Report"}
              </button>
              <div className="space-y-2">
                <textarea
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="Enter reason for dismissing this report..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <button
                  onClick={handleDismiss}
                  disabled={isDismissing}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border border-border hover:bg-accent font-medium transition",
                    isDismissing && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isDismissing ? "Dismissing..." : "Dismiss Report"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
