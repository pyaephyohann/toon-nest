"use client";

import { rankingData } from "./data";
import RankingRow from "./RankingRow";

export default function RankingTable() {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      {rankingData.map((manga) => (
        <RankingRow key={manga.id} manga={manga} />
      ))}
    </section>
  );
}
