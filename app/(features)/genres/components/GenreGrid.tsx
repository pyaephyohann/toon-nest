import { Genre } from "./types";
import GenreCard from "./GenreCard";

interface Props {
  genres: Genre[];
}

export default function GenreGrid({ genres }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Browse Genres</h2>

        <p className="mt-1 text-muted-foreground">
          Explore every category and discover your next favorite series.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {genres.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </div>
    </section>
  );
}
