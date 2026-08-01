"use client";

import { useGetMangaListQuery } from "@/store/api";
import { PodiumItem } from "./types";
import TopThreePodium from "./TopThreePodium";

interface Props {
  timePeriod?: "daily" | "weekly" | "monthly" | "all";
  orderByField?: string;
  orderByDirection?: string;
}

export default function TopThreePodiumContainer({ 
  timePeriod = "all",
  orderByField = "views",
  orderByDirection = "desc"
}: Props) {
  const { data, isLoading, error, isError } = useGetMangaListQuery({ 
    limit: 3,
    timePeriod,
    orderByField,
    orderByDirection
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-muted"
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
  const items: PodiumItem[] = data.items.map((manga: any, index: number) => ({
    rank: index + 1,
    title: manga.title,
    slug: manga.slug,
    cover: manga.coverImage || "/series/solo-leveling.jpeg",
    rating: manga.averageRating || 0,
    readers: formatNumber(manga.readersCount || 0),
  }));

  return <TopThreePodium items={items} />;
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
