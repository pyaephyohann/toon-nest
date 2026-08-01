"use client";

import { useGetMangaListQuery } from "@/store/api";
import { RankingSeries } from "./types";
import RankingSection from "./RankingSection";

export default function RankingContainer({ title }: { title: string }) {
  const { data, isLoading, error, isError } = useGetMangaListQuery({ 
    limit: 3,
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">
            Failed to load popular series. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">No series available yet.</p>
        </div>
      </section>
    );
  }

  // Transform API data to match UI expectations
  const items: RankingSeries[] = data.items.map((manga: any, index: number) => ({
    id: manga.id,
    rank: index + 1,
    title: manga.title,
    slug: manga.slug,
    image: manga.coverImage || "/series/solo-leveling.jpeg",
    genres: manga.genres?.map((g: any) => g.genre.name) || [],
    rating: manga.averageRating || 0,
    badge: manga.isNew ? "NEW" : undefined,
    totalChapters: manga.totalChapters,
    views: manga.views,
    readersCount: manga.readersCount,
  }));

  return <RankingSection title={title} items={items} />;
}
