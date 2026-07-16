"use client";

import TrendingHero from "./TrendingHero";
import TrendingMiniCard from "./TrendingMiniCard";

import { PopularManga } from "./types";

interface Props {
  hero: PopularManga;
  items: PopularManga[];
}

export default function TrendingSidebar({ hero, items }: Props) {
  return (
    <aside className="space-y-6">
      {/* Hero */}
      <TrendingHero manga={hero} />

      {/* Top Movers */}
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold">📈 Top Movers</h3>

          <span className="text-sm text-primary">Today</span>
        </div>

        <div className="space-y-3">
          {items.slice(1, 5).map((manga) => (
            <TrendingMiniCard key={manga.id} manga={manga} />
          ))}
        </div>
      </section>

      {/* Stay Ahead */}
      <section className="rounded-3xl bg-gradient-to-br from-primary to-violet-700 p-6 text-white">
        <h3 className="text-2xl font-bold">⚡ Stay Ahead</h3>

        <p className="mt-3 text-sm text-white/80">
          Get notified whenever a new series starts trending or your favorite
          manga climbs the rankings.
        </p>

        <button className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-primary transition hover:bg-white/90">
          Enable Notifications
        </button>
      </section>
    </aside>
  );
}
