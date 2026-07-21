"use client";

import { Bookmark, BookOpen, Clock3, CheckCircle } from "lucide-react";

export default function StatsCard() {
  const stats = [
    {
      label: "Bookmarked",
      value: 24,
      icon: Bookmark,
      color: "text-primary",
    },
    {
      label: "Reading",
      value: 8,
      icon: BookOpen,
      color: "text-blue-400",
    },
    {
      label: "Completed",
      value: 12,
      icon: CheckCircle,
      color: "text-emerald-400",
    },
    {
      label: "Plan To Read",
      value: 4,
      icon: Clock3,
      color: "text-yellow-400",
    },
  ];

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">My Library</h3>

      <div className="space-y-5">
        {stats.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <item.icon className={item.color} size={20} />

              <span>{item.label}</span>
            </div>

            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
