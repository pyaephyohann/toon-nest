"use client";

import BookmarkCard from "./BookmarkCard";
import { BookmarkManga } from "./types";

interface Props {
  items: BookmarkManga[];
}

export default function BookmarkList({ items }: Props) {
  return (
    <section className="space-y-5">
      {/* Top */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} series bookmarked
        </p>

        <button className="text-sm font-medium text-primary hover:underline">
          Edit
        </button>
      </div>

      {/* Cards */}

      <div className="space-y-4">
        {items.map((manga) => (
          <BookmarkCard key={manga.id} manga={manga} />
        ))}
      </div>
    </section>
  );
}
