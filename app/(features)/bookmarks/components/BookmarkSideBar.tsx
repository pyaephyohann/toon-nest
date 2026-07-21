"use client";

import ContinueReading from "./ContinueReading";
import GenreStats from "./GenreStats";
import PremiumCard from "./PremiumCard";
import StatsCard from "./StatsCard";

export default function BookmarkSideBar() {
  return (
    <aside className="sticky top-24 h-fit space-y-6">
      <StatsCard />

      <ContinueReading />

      <GenreStats />

      <PremiumCard />
    </aside>
  );
}
