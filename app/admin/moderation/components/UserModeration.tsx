"use client";

import { useModerateUserMutation } from "@/store/api/moderationApi";
import { useState } from "react";
import { Search, AlertTriangle, Ban, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserModeration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moderateUser] = useModerateUserMutation();

  type Action = "WARN" | "SUSPEND" | "BAN";

  const handleModerate = async (userId: string, action: Action, reason?: string) => {
    const userReason = reason || prompt(`Enter reason for ${action.toLowerCase()} action:`);
    if (!userReason) return;

    try {
      await moderateUser({ id: userId, action, reason: userReason }).unwrap();
    } catch (error) {
      console.error("Failed to moderate user:", error);
    }
  };

  // Placeholder data - in production, this would come from a moderation-specific API
  const users: any[] = [];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">User Moderation</h3>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* User List */}
      {users.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No users to moderate</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user: any) => (
            <div key={user.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3 mb-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  user.role === "ADMIN" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                )}>
                  {user.role}
                </span>
              </div>
              {user.suspendedAt && (
                <p className="text-sm text-red-600 mb-3">
                  Suspended since {new Date(user.suspendedAt).toLocaleDateString()}
                </p>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModerate(user.id, "WARN")}
                  className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 text-sm font-medium hover:bg-yellow-200 transition flex items-center gap-1"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Warn
                </button>
                <button
                  onClick={() => handleModerate(user.id, "SUSPEND")}
                  className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 text-sm font-medium hover:bg-orange-200 transition flex items-center gap-1"
                >
                  <UserX className="h-4 w-4" />
                  Suspend
                </button>
                <button
                  onClick={() => handleModerate(user.id, "BAN")}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-medium hover:bg-red-200 transition flex items-center gap-1"
                >
                  <Ban className="h-4 w-4" />
                  Ban
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
