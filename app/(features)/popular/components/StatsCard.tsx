"use client";

import { TrendingUp } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change: string;
}

export default function StatsCard({ title, value, change }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>

        <TrendingUp size={18} className="text-green-500" />
      </div>

      <h3 className="mt-3 text-3xl font-bold">{value}</h3>

      <p className="mt-2 text-sm text-green-500">{change} this week</p>
    </div>
  );
}
