"use client";

import { useGetHistoryQuery } from "@/store/api";
import { ContinueReading } from "./types";
import ContinueReadingSection from "./ContinueReadingSection";

export default function ContinueReadingContainer() {
  const { data, isLoading, error, isError } = useGetHistoryQuery({ limit: 4 });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Continue Reading</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Continue Reading</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">
            Failed to load reading history. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Continue Reading</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">
            No reading history yet. Start reading to see your progress here.
          </p>
        </div>
      </section>
    );
  }

  // Transform API data to match UI expectations
  const items: ContinueReading[] = data.items.map((item: any) => ({
    id: item.series?.id || item.id,
    slug: item.series?.slug || "",
    title: item.series?.title || "Unknown Series",
    coverImage: item.series?.coverImage || "/series/solo-leveling.jpeg",
    chapter: item.chapter?.chapterNumber || 0,
    progress: Math.min(Math.round((item.chapter?.chapterNumber || 0) / (item.series?.totalChapters || 100) * 100), 100),
    totalChapters: item.series?.totalChapters,
    updatedAt: item.updatedAt,
  }));

  return <ContinueReadingSection items={items} />;
}
