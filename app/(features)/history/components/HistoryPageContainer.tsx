"use client";

import { useGetHistoryQuery, useClearHistoryMutation, useDeleteHistoryEntryMutation } from "@/store/api";
import { useState } from "react";
import HistoryTimeline from "./HistoryTimeline";
import LoadMore from "./LoadMore";

interface Props {
  page?: number;
  onPageChange?: (page: number) => void;
}

export default function HistoryPageContainer({ page = 1, onPageChange }: Props) {
  const { data, isLoading, error } = useGetHistoryQuery({ page, limit: 20 });
  const [clearHistory] = useClearHistoryMutation();
  const [deleteHistoryEntry] = useDeleteHistoryEntryMutation();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <p className="text-muted-foreground">
          Failed to load reading history. Please try again later.
        </p>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <div className="text-center">
          <p className="text-muted-foreground">No reading history yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Start reading manga to see your history here.
          </p>
        </div>
      </div>
    );
  }

  // Transform API data to match UI expectations
  const items = data.items.map((history) => {
    const chapter = history.chapter;
    const series = chapter?.series;
    return {
      id: series?.id || history.id,
      title: series?.title || "Unknown Series",
      slug: series?.slug || "",
      cover: series?.coverImage || "/series/solo-leveling.jpeg",
      genres: series?.genres?.map((g: any) => g.genre.name) || [],
      rating: series?.averageRating || 0,
      verified: series?.verified || false,
      rank: 0, // Could be calculated based on views
      chapter: chapter?.chapterNumber || 0,
      progress: 100, // Assuming full progress since it's in history
      readers: formatNumber(series?.readersCount || 0),
      totalChapters: series?.totalChapters || 0,
      lastRead: new Date(history.updatedAt).toLocaleDateString(),
      chapterNumber: chapter?.chapterNumber || 0,
      chapterTitle: chapter?.title || `Chapter ${chapter?.chapterNumber}`,
      readAt: new Date(history.updatedAt).toLocaleDateString(),
      seriesId: series?.id || "",
    };
  });

  const totalPages = Math.ceil(data.total / data.limit);

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear all reading history?")) {
      try {
        await clearHistory().unwrap();
      } catch (error) {
        console.error("Failed to clear history:", error);
      }
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteHistoryEntry(id).unwrap();
    } catch (error) {
      console.error("Failed to delete history entry:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reading History</h2>
        <button
          onClick={handleClearHistory}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
        >
          Clear History
        </button>
      </div>
      <HistoryTimeline items={items} />
      {totalPages > 1 && (
        <LoadMore />
      )}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
