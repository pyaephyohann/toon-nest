"use client";

import { ChevronDown } from "lucide-react";

export default function LoadMore() {
  return (
    <div className="flex justify-center">
      <button className="group flex items-center gap-3 rounded-full border border-border bg-card px-8 py-3 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500/10">
        <span className="font-medium">Load More</span>

        <ChevronDown
          size={18}
          className="transition-transform group-hover:translate-y-1"
        />
      </button>
    </div>
  );
}
