"use client";

import { useGetUserStatisticsQuery } from "@/store/api";
import { BookOpen, Bookmark, Star, MessageSquare, Flame } from "lucide-react";

interface Props {
  userId: string;
}

export default function ReadingStatistics({ userId }: Props) {
  const { data: stats, isLoading } = useGetUserStatisticsQuery(userId);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Reading Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const statistics = [
    { label: "Manga Read", value: stats?.uniqueMangaRead || 0, icon: BookOpen, color: "text-blue-500" },
    { label: "Chapters Read", value: stats?.historyCount || 0, icon: BookOpen, color: "text-green-500" },
    { label: "Bookmarks", value: stats?.bookmarksCount || 0, icon: Bookmark, color: "text-yellow-500" },
    { label: "Reviews", value: stats?.ratingsCount || 0, icon: Star, color: "text-purple-500" },
    { label: "Comments", value: stats?.commentsCount || 0, icon: MessageSquare, color: "text-pink-500" },
    { label: "Reading Streak", value: stats?.readingStreak || 0, icon: Flame, color: "text-orange-500" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-semibold mb-4">Reading Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statistics.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-muted/50 p-4">
            <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
