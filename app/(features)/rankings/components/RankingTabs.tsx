"use client";

import { useState } from "react";

const tabs = ["Today", "This Week", "This Month", "All Time"];

export default function RankingTabs() {
  const [active, setActive] = useState("Today");

  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
            active === tab
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
