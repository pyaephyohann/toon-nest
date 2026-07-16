"use client";

import { Crown } from "lucide-react";

interface Props {
  rank: number;
}

export default function RankBadge({ rank }: Props) {
  if (rank === 1) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-lg shadow-yellow-500/30">
        <Crown
          size={18}
          className="absolute -top-2 fill-yellow-300 text-yellow-300"
        />

        <span className="text-xl font-bold text-black">1</span>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-200 to-slate-500 shadow-lg shadow-slate-400/20">
        <span className="text-xl font-bold text-black">2</span>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400 bg-gradient-to-br from-orange-300 to-orange-600 shadow-lg shadow-orange-500/25">
        <span className="text-xl font-bold text-white">3</span>
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary">
      <span className="text-lg font-bold text-muted-foreground">{rank}</span>
    </div>
  );
}
