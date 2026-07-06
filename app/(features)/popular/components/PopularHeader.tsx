"use client";

import { Flame } from "lucide-react";

export default function PopularHeader() {
  return (
    <header className="flex items-center gap-5">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15">
        <Flame className="size-8 fill-primary text-primary" />
      </div>

      <div>
        <h1 className="text-5xl font-bold tracking-tight">Popular</h1>

        <p className="mt-2 text-muted-foreground">
          Discover the most popular series loved by the community.
        </p>
      </div>
    </header>
  );
}
