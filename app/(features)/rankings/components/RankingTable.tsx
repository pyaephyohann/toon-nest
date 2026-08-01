"use client";

import RankingRow from "./RankingRow";
import { RankingManga } from "./types";

interface Props {
  items: RankingManga[];
}

export default function RankingTable({ items }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      {items.map((manga) => (
        <RankingRow key={manga.id} manga={manga} />
      ))}
    </section>
  );
}
