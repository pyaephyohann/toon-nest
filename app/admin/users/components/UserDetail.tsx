"use client";

import { User } from "@/store/api/userApi";
import { useGetUserStatisticsQuery } from "@/store/api/userApi";
import { X, Calendar, BookOpen, MessageSquare, Star, Bookmark, Flame, Shield, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user: User;
  onClose: () => void;
}

export default function UserDetail({ user, onClose }: Props) {
  const { data: stats, isLoading: statsLoading } = useGetUserStatisticsQuery(user.id);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-start gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-2xl font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{user.username}</h3>
              {user.displayName && (
                <p className="text-muted-foreground">{user.displayName}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  user.role === "ADMIN" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                )}>
                  {user.role}
                </span>
                {user.suspendedAt ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Suspended
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm">{user.bio}</p>
            </div>
          )}

          {/* Statistics */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Activity Statistics
            </h4>
            {statsLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-muted" />
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm">Bookmarks</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.bookmarksCount}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">Reads</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.historyCount}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">Ratings</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.ratingsCount}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">Comments</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.commentsCount}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No statistics available</p>
            )}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Flame className="h-4 w-4" />
                <span className="text-sm">Reading Streak</span>
              </div>
              <p className="text-2xl font-bold">{stats?.readingStreak || user.readingStreak || 0} days</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">Manga Read</span>
              </div>
              <p className="text-2xl font-bold">{stats?.uniqueMangaRead || 0}</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
            </div>
            {user.suspendedAt && (
              <div className="flex items-center gap-2 text-destructive">
                <UserX className="h-4 w-4" />
                <span>Suspended: {new Date(user.suspendedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
