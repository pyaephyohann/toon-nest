"use client";

import { useGetMangaListQuery } from "@/store/api";
import { PopularManga } from "./types";
import RankingSection from "./RankingSection";

export default function RankingContainer() {
  const { data, isLoading, error, isError } = useGetMangaListQuery({ 
    limit: 8,
    page: 2
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-muted"
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
  const items: PopularManga[] = data.items.map((manga: any, index: number) => ({
    id: manga.id,
    rank: index + 4,
    title: manga.title,
    slug: manga.slug,
    cover: manga.coverImage || "/series/solo-leveling.jpeg",
    genres: manga.genres?.map((g: any) => g.genre.name) || [],
    rating: manga.averageRating || 0,
    readers: formatNumber(manga.readersCount || 0),
    chapters: manga.totalChapters || 0,
    isPremium: false,
    isTrending: manga.isFeatured || false,
  }));

  return <RankingSection items={items} />;
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
