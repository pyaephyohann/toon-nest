"use client";

import { genres, stats } from "./data";
import GenreProgress from "./GenreProgress";
import PremiumCard from "./PremiumCard";
import StatsCard from "./StatsCard";

export default function PopularSidebar() {
  return (
    <aside className="space-y-6">
      {/* Stats */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">📈 Weekly Statistics</h2>

        <div className="space-y-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
            />
          ))}
        </div>
      </div>

      {/* Genres */}

      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-bold">🔥 Top Genres</h2>

        <div className="space-y-5">
          {genres.map((genre) => (
            <GenreProgress
              key={genre.id}
              name={genre.name}
              readers={genre.readers}
              percentage={genre.percentage}
            />
          ))}
        </div>
      </div>

      <PremiumCard />
    </aside>
  );
}
