import UpdateCard from "./UpdateCard";
import { UpdateItem } from "./types";

interface Props {
  title: string;
  items: UpdateItem[];
}

export default function UpdateSection({ title, items }: Props) {
  return (
    <section className="relative pl-8">
      {/* Timeline */}
      <div className="absolute left-3 top-0 h-full w-px bg-border" />

      <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-4 border-primary bg-background" />

      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div className="space-y-5">
        {items.map((item) => (
          <UpdateCard key={item.id} manga={item} />
        ))}
      </div>
    </section>
  );
}
