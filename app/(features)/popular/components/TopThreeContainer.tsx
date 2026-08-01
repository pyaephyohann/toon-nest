"use client";

import { useGetMangaListQuery } from "@/store/api";
import { PopularManga } from "./types";
import TopThreeSection from "./TopThreeSection";

export default function TopThreeContainer() {
  const { data, isLoading, error, isError } = useGetMangaListQuery({ limit: 3 });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-muted"
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
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">
            Failed to load top series. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <section className="space-y-6">
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
    chapters: manga.totalChapters || 0,
    isPremium: false,
    isTrending: manga.isFeatured || false,
  }));

  return <TopThreeSection items={items} />;
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
