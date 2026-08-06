"use client";

import { ModerationAction } from "@/store/api/moderationApi";
import { useGetModerationHistoryQuery } from "@/store/api/moderationApi";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetModerationHistoryParams } from "@/store/api/moderationApi";

export default function ModerationHistory() {
  const [params, setParams] = useState<GetModerationHistoryParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error } = useGetModerationHistoryQuery(params);

  const handleFilter = (filter: keyof GetModerationHistoryParams, value: string | undefined) => {
    setParams({ ...params, [filter]: value, page: 1 });
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
        <p className="text-center text-muted-foreground">Failed to load moderation history</p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No moderation history found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Moderation History</h3>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          onChange={(e) => handleFilter("actionType", e.target.value === "all" ? undefined : e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Actions</option>
          <option value="APPROVE">Approve</option>
          <option value="DELETE">Delete</option>
          <option value="HIDE">Hide</option>
          <option value="WARN">Warn</option>
          <option value="SUSPEND">Suspend</option>
          <option value="BAN">Ban</option>
        </select>
        <select
          onChange={(e) => handleFilter("targetType", e.target.value === "all" ? undefined : e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Targets</option>
          <option value="COMMENT">Comment</option>
          <option value="RATING">Rating</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* History List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Moderator</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Target</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((action) => (
                <tr key={action.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {action.moderator.avatar ? (
                        <img
                          src={action.moderator.avatar}
                          alt={action.moderator.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-xs font-medium">
                            {action.moderator.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm">{action.moderator.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      action.actionType === "APPROVE" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                      action.actionType === "DELETE" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                      action.actionType === "HIDE" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      action.actionType === "WARN" && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                      action.actionType === "SUSPEND" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                      action.actionType === "BAN" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    )}>
                      {action.actionType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {action.targetType} ({action.targetId.slice(0, 8)}...)
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {action.reason || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(action.createdAt).toLocaleString()}
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
              {Math.min((params.page || 1) * (params.limit || 10), data.total)} of {data.total} actions
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
