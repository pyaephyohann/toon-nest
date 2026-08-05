"use client";

import { RecentActivity as RecentActivityType } from "@/store/api";
import { BookOpen, FileText, Users, CreditCard, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Props {
  activity: RecentActivityType;
  isLoading?: boolean;
}

export default function RecentActivity({ activity, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div className="space-y-6">
      {/* Recent Manga */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Recently Added Manga</h3>
        </div>
        <div className="space-y-3">
          {activity.recentManga.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent manga</p>
          ) : (
            activity.recentManga.map((manga) => (
              <Link
                key={manga.id}
                href={`/series/${manga.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition"
              >
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{manga.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(manga.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Recent Chapters */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Recently Published Chapters</h3>
        </div>
        <div className="space-y-3">
          {activity.recentChapters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent chapters</p>
          ) : (
            activity.recentChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/series/${chapter.series.slug}/chapter/${chapter.chapterNumber}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {chapter.series.title} - Chapter {chapter.chapterNumber}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(chapter.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* New Users */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">New Users</h3>
        </div>
        <div className="space-y-3">
          {activity.newUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new users</p>
          ) : (
            activity.newUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(user.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Recent Payments</h3>
        </div>
        <div className="space-y-3">
          {activity.recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent payments</p>
          ) : (
            activity.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-3 p-3 rounded-lg">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {payment.user.username} - ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(payment.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Comments */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Recent Comments</h3>
        </div>
        <div className="space-y-3">
          {activity.recentComments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent comments</p>
          ) : (
            activity.recentComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {comment.user.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.username} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{comment.user.username}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{comment.content}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
