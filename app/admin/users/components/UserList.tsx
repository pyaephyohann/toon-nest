"use client";

import { User } from "@/store/api/userApi";
import { GetUsersParams } from "@/store/api/userApi";
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserAdminMutation, useSuspendUserMutation, useReactivateUserMutation } from "@/store/api/userApi";
import { useState } from "react";
import { Search, ArrowUpDown, Edit, Trash2, ChevronLeft, ChevronRight, Shield, ShieldAlert, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onEdit: (user: User) => void;
  onViewDetails: (user: User) => void;
}

export default function UserList({ onEdit, onViewDetails }: Props) {
  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetUsersQuery(params);
  const [deleteUser] = useDeleteUserMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ ...params, search: searchQuery, page: 1 });
  };

  const handleSort = (sortBy: "createdAt" | "username" | "readingStreak") => {
    if (params.sortBy === sortBy) {
      setParams({ ...params, sortOrder: params.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setParams({ ...params, sortBy, sortOrder: "asc" });
    }
  };

  const handleFilter = (filter: keyof GetUsersParams, value: string | boolean | undefined) => {
    setParams({ ...params, [filter]: value, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUser({ id, admin: true }).unwrap();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleToggleSuspend = async (user: User) => {
    try {
      if (user.suspendedAt) {
        await reactivateUser(user.id).unwrap();
      } else {
        await suspendUser(user.id).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle suspension status:", error);
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
        <p className="text-center text-muted-foreground">Failed to load users</p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
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
        </form>

        <div className="flex gap-2 flex-wrap">
          <select
            value={params.role || "all"}
            onChange={(e) => handleFilter("role", e.target.value === "all" ? undefined : e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={params.isSuspended === undefined ? "all" : params.isSuspended ? "suspended" : "active"}
            onChange={(e) => handleFilter("isSuspended", e.target.value === "all" ? undefined : e.target.value === "suspended")}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("readingStreak")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    Streak
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Activity</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    Joined
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{user.username}</div>
                        {user.displayName && (
                          <div className="text-xs text-muted-foreground">{user.displayName}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.suspendedAt ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{user.readingStreak || 0}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user._count?.bookmarks || 0} bookmarks, {user._count?.history || 0} reads
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(user)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="View Details"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(user)}
                        disabled={user.role === "ADMIN"}
                        className={cn(
                          "p-2 rounded-lg hover:bg-accent transition",
                          user.role === "ADMIN" && "opacity-50 cursor-not-allowed"
                        )}
                        title={user.suspendedAt ? "Reactivate" : "Suspend"}
                      >
                        {user.suspendedAt ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.role === "ADMIN"}
                        className={cn(
                          "p-2 rounded-lg hover:bg-destructive/10 text-destructive transition",
                          user.role === "ADMIN" && "opacity-50 cursor-not-allowed"
                        )}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
              {Math.min((params.page || 1) * (params.limit || 10), data.total)} of {data.total} users
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
