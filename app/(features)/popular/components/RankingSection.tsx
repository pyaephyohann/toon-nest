"use client";

import { PopularManga } from "./types";
import RankingCard from "./RankingCard";

interface Props {
  items: PopularManga[];
}

export default function RankingSection({ items }: Props) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Popular Rankings</h2>

          <p className="text-muted-foreground">Most read manga this week.</p>
        </div>

        <button className="rounded-xl bg-primary px-5 py-3 text-white hover:bg-primary-hover">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {items.map((manga) => (
          <RankingCard key={manga.id} manga={manga} />
        ))}
      </div>
    </section>
  );
}
