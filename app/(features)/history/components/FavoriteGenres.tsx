"use client";

import ProgressBar from "@/components/ui/ProgressBar";

const genres = [
  {
    name: "Action",
    value: 92,
  },
  {
    name: "Fantasy",
    value: 84,
  },
  {
    name: "Adventure",
    value: 71,
  },
  {
    name: "Magic",
    value: 56,
  },
  {
    name: "Romance",
    value: 40,
  },
];

export default function FavoriteGenres() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">Favorite Genres</h3>

        <span className="text-sm text-primary">Reading Habits</span>
      </div>

      <div className="space-y-5">
        {genres.map((genre) => (
          <div key={genre.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span>{genre.name}</span>

              <span>{genre.value}%</span>
            </div>

            <ProgressBar progress={genre.value} showLabel={false} size="md" />
          </div>
        ))}
      </div>
    </section>
  );
}
