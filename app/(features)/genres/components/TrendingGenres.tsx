"use client";

import GenreRankingItem from "./GenreRankingItem";

const rankings = [
  {
    rank: 1,
    name: "Fantasy",
    total: 2315,
    progress: 94,
    color: "#8b5cf6",
  },
  {
    rank: 2,
    name: "Action",
    total: 2091,
    progress: 90,
    color: "#ef4444",
  },
  {
    rank: 3,
    name: "Romance",
    total: 1745,
    progress: 82,
    color: "#ec4899",
  },
  {
    rank: 4,
    name: "Adventure",
    total: 1688,
    progress: 77,
    color: "#10b981",
  },
  {
    rank: 5,
    name: "Comedy",
    total: 1520,
    progress: 70,
    color: "#f59e0b",
  },
];
export default function TrendingGenres() {
  return (
    <aside className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold">🔥 Trending Genres</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Most read this week
        </p>
      </div>

      <div className="space-y-6">
        {rankings.map((genre) => (
          <GenreRankingItem key={genre.rank} {...genre} />
        ))}
      </div>
    </aside>
  );
}
