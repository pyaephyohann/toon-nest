"use client";

import { ChevronDown, LayoutGrid, List } from "lucide-react";

const filters = ["All", "Reading", "Plan To Read", "On Hold", "Dropped"];

export default function FilterBar() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-4">
      {/* Left */}

      <div className="flex flex-wrap gap-3">
        {filters.map((item, index) => (
          <button
            key={item}
            className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition ${
              index === 0
                ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                : "border-border bg-card hover:border-primary hover:text-primary"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 hover:border-primary">
          Last Added
          <ChevronDown size={18} />
        </button>

        <button className="rounded-xl border border-border bg-card p-3 hover:border-primary">
          <LayoutGrid size={18} />
        </button>

        <button className="rounded-xl border border-border bg-card p-3 hover:border-primary">
          <List size={18} />
        </button>
      </div>
    </section>
  );
}
