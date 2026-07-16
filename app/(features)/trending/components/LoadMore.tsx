"use client";

import { ChevronDown } from "lucide-react";

export default function LoadMore() {
  return (
    <div className="flex justify-center">
      <button className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-8 py-4 font-semibold transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white">
        Load More Rankings
        <ChevronDown className="transition group-hover:translate-y-1" />
      </button>
    </div>
  );
}
