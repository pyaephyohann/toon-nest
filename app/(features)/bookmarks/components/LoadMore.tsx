"use client";

import { ChevronDown } from "lucide-react";

export default function LoadMore() {
  return (
    <div className="flex justify-center pt-4">
      <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3 font-medium transition hover:border-primary hover:text-primary">
        Load More
        <ChevronDown size={18} />
      </button>
    </div>
  );
}
