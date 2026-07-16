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
  "Sci-Fi",
];

export default function FilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div className="flex flex-wrap gap-3">
        {genres.map((genre, index) => (
          <button
            key={genre}
            className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition ${
              index === 0
                ? "border-primary bg-primary text-white"
                : "border-border bg-card hover:border-primary hover:text-primary"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 hover:border-primary">
          This Week
          <ChevronDown size={16} />
        </button>

        <button className="rounded-xl border border-border bg-card p-3 hover:border-primary">
          <Grid2X2 size={18} />
        </button>

        <button className="rounded-xl border border-border bg-card p-3 hover:border-primary">
          <List size={18} />
        </button>
      </div>
    </div>
  );
}
