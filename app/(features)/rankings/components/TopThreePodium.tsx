"use client";

import PodiumCard from "./PodiumCard";
import { podiumData } from "./data";

export default function TopThreePodium() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {podiumData.map((item) => (
        <PodiumCard key={item.rank} {...item} />
      ))}
    </section>
  );
}
