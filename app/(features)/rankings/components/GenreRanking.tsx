"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import { genrePopularityData } from "./data";

export default function GenreRanking() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Genre Popularity</h2>

      <div className="mt-6 space-y-5">
        {genrePopularityData.map((genre) => (
          <div key={genre.id}>
            <div className="mb-2 flex justify-between text-sm">
              <span>{genre.name}</span>

              <span className="text-muted-foreground">{genre.percentage}%</span>
            </div>

            <ProgressBar
              progress={genre.percentage}
              showLabel={false}
              size="sm"
              customColor={genre.color}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
