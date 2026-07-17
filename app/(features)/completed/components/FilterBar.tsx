"use client";

import { Grid2X2, List, ChevronDown } from "lucide-react";

const genres = [
  "All",
  "Action",
  "Fantasy",
  "Romance",
  "Comedy",
  "Drama",
  "School",
];

export default function FilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      {/* Genres */}
      <div className="flex flex-wrap gap-3">
        {genres.map((genre, index) => (
          <button
            key={genre}
            className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              index === 0
                ? "border-completed bg-completed text-white shadow-lg shadow-completed/25"
                : "border-border bg-card hover:border-completed hover:text-completed-400"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 transition hover:border-emerald-500">
          Rating
          <ChevronDown size={18} />
        </button>

        <button className="rounded-xl border border-border bg-card p-3 transition hover:border-emerald-500">
          <Grid2X2 size={20} />
        </button>

        <button className="rounded-xl border border-border bg-card p-3 transition hover:border-emerald-500">
          <List size={20} />
        </button>
      </div>
    </div>
  );
}
