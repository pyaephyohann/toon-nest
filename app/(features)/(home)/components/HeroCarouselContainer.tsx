"use client";

import { useGetMangaListQuery } from "@/store/api";
import HeroCarousel from "./HeroCarousel";

export default function HeroCarouselContainer() {
  // Fetch featured manga (isFeatured: true)
  const { data, isLoading, error } = useGetMangaListQuery({
    limit: 5,
    orderByField: "views",
    orderByDirection: "desc",
  });

  // Loading state - show original component with loading indicator
  if (isLoading) {
    return (
      <div className="relative h-[450px] animate-pulse rounded-3xl border border-border bg-muted" />
    );
  }

  // Error state - show original component with error
  if (error) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-3xl border border-border bg-card">
        <p className="text-muted-foreground">Failed to load featured series.</p>
      </div>
    );
  }

  // Transform API data to match Banner interface
  const banners = data?.items
    .filter((manga) => manga.isFeatured || manga.views > 1000) // Featured or popular
    .slice(0, 5)
    .map((manga) => ({
      id: manga.id,
      title: manga.title,
      description: manga.description,
      image: manga.bannerImage || manga.coverImage,
      genres: manga.genres?.map((g: any) => g.genre.name) || [],
      style: "action" as const, // Default style, could be determined by genre
      slug: manga.slug,
    })) || [];

  // If no featured manga, return empty state
  if (banners.length === 0) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-3xl border border-border bg-card">
        <p className="text-muted-foreground">No featured series available.</p>
      </div>
    );
  }

  return <HeroCarousel banners={banners} />;
}
