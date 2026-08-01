"use client";

import { useGetMangaListQuery } from "@/store/api";
import { RankingManga } from "./types";
import RankingTable from "./RankingTable";

export default function RankingTableContainer() {
  const { data, isLoading, error, isError } = useGetMangaListQuery({ limit: 10 });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="space-y-4">
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">
            Failed to load rankings. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">No series available yet.</p>
        </div>
      </section>
    );
  }

  // Transform API data to match UI expectations
  const items: RankingManga[] = data.items.map((manga: any, index: number) => ({
    ...manga,
    rank: index + 1,
    author: manga.author || "Unknown",
    readers: formatNumber(manga.readersCount || 0),
    chapters: manga.totalChapters || 0,
    trend: Math.floor(Math.random() * 20) - 10, // Mock trend data
    completed: manga.status === "COMPLETED",
    verified: manga.verified || false,
  }));

  return <RankingTable items={items} />;
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
