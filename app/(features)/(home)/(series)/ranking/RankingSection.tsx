import RankingCard from "./RankingCard";
import { RankingSeries } from "./types";

interface Props {
  title: string;
  items: RankingSeries[];
}

export default function RankingSection({ title, items }: Props) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>

        <button className="text-sm font-semibold text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <RankingCard key={item.id} manga={item} />
        ))}
      </div>
    </section>
  );
}
