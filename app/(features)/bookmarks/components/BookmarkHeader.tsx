"use client";

import { Bookmark } from "lucide-react";

export default function BookmarkHeader() {
  return (
    <header className="space-y-8">
      {/* Heading */}
      <div className="flex items-center gap-5">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15">
          <Bookmark className="size-8 fill-primary text-primary" />
        </div>

        <div>
          <h1 className="text-5xl font-bold tracking-tight">Bookmarks</h1>

          <p className="mt-2 text-muted-foreground">
            Your saved series to read later.
          </p>
        </div>
      </div>
    </header>
  );
}
