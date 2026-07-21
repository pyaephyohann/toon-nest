"use client";

const genres = [
  {
    name: "Action",
    total: 14,
    width: 95,
  },
  {
    name: "Fantasy",
    total: 11,
    width: 80,
  },
  {
    name: "Adventure",
    total: 8,
    width: 65,
  },
  {
    name: "Romance",
    total: 5,
    width: 45,
  },
];

export default function GenreStats() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">Top Genres</h3>

      <div className="space-y-5">
        {genres.map((genre) => (
          <div key={genre.name}>
            <div className="mb-2 flex justify-between">
              <span>{genre.name}</span>

              <span className="text-muted-foreground">{genre.total}</span>
            </div>

            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${genre.width}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
