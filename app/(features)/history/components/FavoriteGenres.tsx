"use client";

const genres = [
  {
    name: "Action",
    value: 92,
    color: "bg-red-500",
  },
  {
    name: "Fantasy",
    value: 84,
    color: "bg-violet-500",
  },
  {
    name: "Adventure",
    value: 71,
    color: "bg-sky-500",
  },
  {
    name: "Magic",
    value: 56,
    color: "bg-emerald-500",
  },
  {
    name: "Romance",
    value: 40,
    color: "bg-pink-500",
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

            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${genre.color}`}
                style={{
                  width: `${genre.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
