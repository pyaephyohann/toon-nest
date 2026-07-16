import TrendingCard from "./TrendingCard";
import { PopularManga } from "./types";

interface Props {
  items: PopularManga[];
}

export default function TrendingList({ items }: Props) {
  return (
    <section className="space-y-4">
      {items.map((manga) => (
        <TrendingCard key={manga.id} manga={manga} />
      ))}
    </section>
  );
}
