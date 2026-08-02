"use client";

import { useGetFavoriteGenresQuery } from "@/store/api";
import { Tag } from "lucide-react";

interface Props {
  userId: string;
}

export default function FavoriteGenres({ userId }: Props) {
  const { data: genres, isLoading } = useGetFavoriteGenresQuery({ id: userId, limit: 5 });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Favorite Genres</h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!genres || genres.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Favorite Genres</h3>
        <p className="text-muted-foreground">No favorite genres yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Tag className="h-5 w-5" />
        Favorite Genres
      </h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((_genre) => (
          <span
            key={_genre.name}
            className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
          >
            {_genre.name}
          </span>
        ))}
      </div>
    </div>
  );
}
