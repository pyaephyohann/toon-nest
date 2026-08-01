"use client";

import { useGetGenresQuery } from "@/store/api";
import { Genre } from "./types";
import GenreGrid from "./GenreGrid";

export default function GenreGridContainer() {
  const { data, isLoading, error, isError } = useGetGenresQuery({});

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Browse Genres</h2>
          <p className="mt-1 text-muted-foreground">
            Explore every category and discover your next favorite series.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
        <div>
          <h2 className="text-2xl font-bold">Browse Genres</h2>
          <p className="mt-1 text-muted-foreground">
            Explore every category and discover your next favorite series.
          </p>
        </div>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              Failed to load genres. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Browse Genres</h2>
          <p className="mt-1 text-muted-foreground">
            Explore every category and discover your next favorite series.
          </p>
        </div>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No genres available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  // Transform API data to match UI expectations
  const genres: Genre[] = data.items.map((genre: any) => ({
    id: genre.id,
    name: genre.name,
    slug: genre.slug,
    icon: genre.icon || "📚",
    color: genre.color || "var(--genre-default)",
    cover: "/banners/the-beginning-after-the-end.jpeg", // Default cover for now
    seriesCount: 0, // Will be populated when series relation is included
    createdAt: genre.createdAt,
    updatedAt: genre.updatedAt,
  }));

  return <GenreGrid genres={genres} />;
}
