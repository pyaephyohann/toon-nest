"use client";

import PodiumCard from "./PodiumCard";

interface Props {
  rank: number;
  title: string;
  slug: string;
  cover: string;
  rating: number;
  readers: string;
}

interface PodiumProps {
  items: Props[];
}

export default function TopThreePodium({ items }: PodiumProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {items.map((item) => (
        <PodiumCard key={item.rank} {...item} />
      ))}
    </section>
  );
}
