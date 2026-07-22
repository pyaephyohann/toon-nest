"use client";

import HistoryCard from "./HistoryCard";
import { HistoryItem } from "./types";

interface Props {
  items: HistoryItem[];
}

export default function HistoryTimeline({ items }: Props) {
  return (
    <section className="relative pl-10">
      {/* Timeline */}

      <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

      {/* Today */}

      <div className="relative mb-10">
        <div className="absolute -left-[34px] top-2 h-4 w-4 rounded-full border-4 border-primary bg-background" />

        <h2 className="mb-6 text-2xl font-bold">Today</h2>

        <div className="space-y-5">
          {items.slice(0, 2).map((manga) => (
            <HistoryCard key={manga.id} manga={manga} />
          ))}
        </div>
      </div>

      {/* Yesterday */}

      <div className="relative mb-10">
        <div className="absolute -left-[34px] top-2 h-4 w-4 rounded-full border-4 border-primary bg-background" />

        <h2 className="mb-6 text-2xl font-bold">Yesterday</h2>

        <div className="space-y-5">
          {items.slice(2, 4).map((manga) => (
            <HistoryCard key={manga.id} manga={manga} />
          ))}
        </div>
      </div>

      {/* Last Week */}

      <div className="relative">
        <div className="absolute -left-[34px] top-2 h-4 w-4 rounded-full border-4 border-primary bg-background" />

        <h2 className="mb-6 text-2xl font-bold">Last Week</h2>

        <div className="space-y-5">
          {items.slice(4).map((manga) => (
            <HistoryCard key={manga.id} manga={manga} />
          ))}
        </div>
      </div>
    </section>
  );
}
