"use client";

import { Flame } from "lucide-react";

export default function TrendingHeader() {
  return (
    <header className="space-y-5">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
          <Flame className="h-8 w-8 fill-primary text-primary" />
        </div>

        <div>
          <h1 className="text-5xl font-bold tracking-tight">Trending</h1>

          <p className="mt-2 text-muted-foreground">
            Hot and rising series everyone is talking about.
          </p>
        </div>
      </div>
    </header>
  );
}
