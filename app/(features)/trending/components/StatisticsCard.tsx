"use client";

import { TrendingUp } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change: string;
}

export default function StatisticsCard({ title, value, change }: Props) {
  return (
    <div className="group rounded-3xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>

        <div className="rounded-xl bg-primary/15 p-2">
          <TrendingUp className="text-primary" size={18} />
        </div>
      </div>

      <h3 className="mt-4 text-4xl font-bold">{value}</h3>

      <p className="mt-3 text-sm font-medium text-green-400">
        ▲ {change} this week
      </p>
    </div>
  );
}
