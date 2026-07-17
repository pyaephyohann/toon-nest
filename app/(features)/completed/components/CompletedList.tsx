"use client";

import CompletedCard from "./CompletedCard";
import { CompletedManga } from "./types";

interface Props {
  items: CompletedManga[];
}

export default function CompletedList({ items }: Props) {
  return (
    <section className="space-y-5">
      {items.map((manga) => (
        <CompletedCard key={manga.id} manga={manga} />
      ))}
    </section>
  );
}
