import ContinueReadingCard from "./ContinueReadingCard";
import { ContinueReading } from "./types";

interface Props {
  items: ContinueReading[];
}

// Need to show Top 5 continue reading

export default function ContinueReadingSection({ items }: Props) {
  const top5Items = items.slice(0, 5);

  return (
    <section className="space-y-5 overflow-x-scroll scrollbar-hide w-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Continue Reading</h2>

        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {top5Items.map((item) => (
          <ContinueReadingCard key={item.id} manga={item} />
        ))}
      </div>
    </section>
  );
}
