"use client";

import { BookOpen, Star, Layers3, Trophy } from "lucide-react";

import { Stats } from "./types";

interface Props {
  stats: Stats;
}

export default function CompletionStats({ stats }: Props) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">Completion Stats</h3>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-completed" size={20} />
            <span>Total Series</span>
          </div>

          <span className="font-bold">
            {stats.totalSeries.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers3 className="text-completed" size={20} />
            <span>Avg Chapters</span>
          </div>

          <span className="font-bold">{stats.averageChapters}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-400" size={20} />
            <span>Highest Rated</span>
          </div>

          <span className="font-semibold">{stats.highestRated}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-completed" size={20} />
            <span>Longest</span>
          </div>

          <span className="font-semibold">{stats.longestSeries}</span>
        </div>
      </div>
    </section>
  );
}
