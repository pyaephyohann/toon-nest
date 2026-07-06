"use client";

import { LayoutGrid, List, ChevronDown } from "lucide-react";

const timeFilters = ["Today", "Week", "Month", "All Time"];

const genreFilters = [
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
      {/* Left */}
      <div className="flex flex-wrap items-center gap-5">
        {/* Time */}
        <div className="flex gap-2">
          {timeFilters.map((item, index) => (
            <button
              key={item}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                index === 1
                  ? "bg-primary text-white"
                  : "bg-card hover:bg-secondary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Genres */}
        <div className="flex flex-wrap gap-2">
          {genreFilters.map((genre, index) => (
            <button
              key={genre}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                index === 0
                  ? "bg-primary text-white"
                  : "bg-card hover:bg-secondary"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-xl bg-card px-5 py-2.5 hover:bg-secondary">
          Popularity
          <ChevronDown size={16} />
        </button>

        <button className="rounded-xl bg-card p-3 hover:bg-secondary">
          <LayoutGrid size={18} />
        </button>

        <button className="rounded-xl bg-card p-3 hover:bg-secondary">
          <List size={18} />
        </button>
      </div>
    </div>
  );
}
