"use client";

import { TrendingUp, ArrowUp } from "lucide-react";
import { gainersData } from "./data";

export default function TopGainers() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="text-emerald-400" />

        <h2 className="text-xl font-bold">Top Gainers</h2>
      </div>

      <div className="mt-6 space-y-5">
        {gainersData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium">{item.title}</span>

            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
              <ArrowUp size={14} />
              {item.change}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
