"use client";

import EditorsPick from "./EditorsPick";
import CollectionsSection from "./CollectionsSection";
import CompletionStats from "./CompletionStats";
import WeekendBinge from "./WeekendBinge";

import { completedSeries, collections, stats } from "./data";

export default function CompletedSidebar() {
  return (
    <aside className="space-y-8">
      <EditorsPick manga={completedSeries[0]} />

      <CollectionsSection items={collections} />

      <CompletionStats stats={stats} />

      <WeekendBinge />
    </aside>
  );
}
