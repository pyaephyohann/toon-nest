"use client";

import { useGetBookmarksQuery } from "@/store/api";
import { Bookmark } from "lucide-react";
import Link from "next/link";

interface Props {
  userId: string;
}

export default function FavoriteManga({ userId }: Props) {
  const { data: bookmarksData, isLoading } = useGetBookmarksQuery({ page: 1, limit: 5 });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Favorite Manga</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const bookmarks = bookmarksData?.items || [];

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Favorite Manga
        </h3>
        <p className="text-muted-foreground">No bookmarks yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Bookmark className="h-5 w-5" />
        Favorite Manga
      </h3>
      <div className="space-y-3">
        {bookmarks.map((bookmark: any) => (
          <Link
            key={bookmark.id}
            href={`/series/${bookmark.series.slug}`}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary hover:bg-accent"
          >
            <img
              src={bookmark.series.coverImage}
              alt={bookmark.series.title}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{bookmark.series.title}</p>
              <p className="text-sm text-muted-foreground">
                {bookmark.series.totalChapters} chapters
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
