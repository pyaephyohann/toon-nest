"use client";

import { useGetMangaListQuery } from "@/store/api";
import { PopularManga } from "./types";
import TrendingList from "./TrendingList";

export default function TrendingListContainer() {
  const { data, isLoading, error, isError } = useGetMangaListQuery({ limit: 10 });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-muted"
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
            Failed to load trending series. Please try again later.
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
  const items: PopularManga[] = data.items.map((manga: any, index: number) => ({
    id: manga.id,
    rank: index + 1,
    title: manga.title,
    slug: manga.slug,
    cover: manga.coverImage || "/series/solo-leveling.jpeg",
    genres: manga.genres?.map((g: any) => g.genre.name) || [],
    rating: manga.averageRating || 0,
    readers: formatNumber(manga.readersCount || 0),
    trend: Math.floor(Math.random() * 20) + 1, // Mock trend data for now
    isHot: manga.isFeatured || false,
  }));

  return <TrendingList items={items} />;
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
