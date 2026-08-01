"use client";

import { useGetMangaListQuery } from "@/store/api";
import { PopularManga } from "../../trending/components/types";
import TrendingList from "../../trending/components/TrendingList";

interface Props {
  title?: string;
}

export default function TrendingSectionContainer({ title = "Trending Now" }: Props) {
  const { data, isLoading, error } = useGetMangaListQuery({
    limit: 10,
    orderByField: "views",
    orderByDirection: "desc",
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">Failed to load trending series.</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">No trending series available.</p>
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
    trend: Math.floor(Math.random() * 20) + 1,
    isHot: manga.isFeatured || false,
  }));

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <TrendingList items={items} />
    </section>
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
