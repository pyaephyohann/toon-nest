"use client";

import { useGetBookmarksQuery } from "@/store/api";
import { BookmarkManga } from "./types";
import BookmarkList from "./BookmarkList";
import LoadMore from "./LoadMore";

interface Props {
  page?: number;
  onPageChange?: (page: number) => void;
}

export default function BookmarksPageContainer({ page = 1, onPageChange }: Props) {
  const { data, isLoading, error } = useGetBookmarksQuery({ page, limit: 20 });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <p className="text-muted-foreground">
          Failed to load bookmarks. Please try again later.
        </p>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <div className="text-center">
          <p className="text-muted-foreground">No bookmarks yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Start adding manga to your bookmarks to see them here.
          </p>
        </div>
      </div>
    );
  }

  // Transform API data to match UI expectations
  const items: BookmarkManga[] = data.items.map((bookmark) => {
    const series = bookmark.series;
    return {
      id: series.id,
      title: series.title,
      slug: series.slug,
      cover: series.coverImage,
      genres: series.genres?.map((g: any) => g.genre.name) || [],
      rating: series.averageRating,
      verified: series.verified,
      rank: 0, // Could be calculated based on views
      chapter: 0, // Could be enhanced with reading progress
      progress: 0, // Could be enhanced with reading progress
      readers: formatNumber(series.readersCount || 0),
      status: "Reading" as const, // Default status, could be enhanced with user preferences
      totalChapters: series.totalChapters,
      averageRating: series.averageRating,
      readersCount: series.readersCount,
      views: series.views,
    };
  });

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-6">
      <BookmarkList items={items} />
      {totalPages > 1 && (
        <LoadMore />
      )}
    </div>
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
