"use client";

import { useGetMangaListQuery } from "@/store/api";
import { PopularManga } from "./types";
import TrendingSidebar from "./TrendingSidebar";

export default function TrendingSidebarContainer() {
  const { data, isLoading, error, isError } = useGetMangaListQuery({ limit: 5 });

  // Loading state
  if (isLoading) {
    return (
      <aside className="space-y-6">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </aside>
    );
  }

  // Error state - return minimal sidebar
  if (isError || !data || data.items.length === 0) {
    return (
      <aside className="space-y-6">
        {/* Stay Ahead */}
        <section className="rounded-3xl bg-gradient-to-br from-primary to-violet-700 p-6 text-white">
          <h3 className="text-2xl font-bold">⚡ Stay Ahead</h3>

          <p className="mt-3 text-sm text-white/80">
            Get notified whenever a new series starts trending or your favorite
            manga climbs the rankings.
          </p>

          <button className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-primary transition hover:bg-white/90">
            Enable Notifications
          </button>
        </section>
      </aside>
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

  const hero = items[0];

  return <TrendingSidebar hero={hero} items={items} />;
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
