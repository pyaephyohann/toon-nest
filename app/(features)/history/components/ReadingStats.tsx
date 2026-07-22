"use client";

import { BookOpen, Clock3, CalendarDays, Flame } from "lucide-react";

export default function ReadingStats() {
  const stats = [
    {
      icon: BookOpen,
      label: "Series Read",
      value: "186",
      color: "text-primary",
    },
    {
      icon: Clock3,
      label: "Hours Read",
      value: "824h",
      color: "text-sky-400",
    },
    {
      icon: CalendarDays,
      label: "This Month",
      value: "48 Chapters",
      color: "text-emerald-400",
    },
    {
      icon: Flame,
      label: "Reading Streak",
      value: "26 Days",
      color: "text-orange-400",
    },
  ];

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">Reading Stats</h3>

      <div className="space-y-5">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl bg-secondary p-3 ${item.color}`}>
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>

                  <h4 className="font-semibold">{item.value}</h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
