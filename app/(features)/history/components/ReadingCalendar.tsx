"use client";

const weeks = Array.from({ length: 15 });
const days = Array.from({ length: 7 });

export default function ReadingCalendar() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">Reading Activity</h3>

        <span className="text-xs text-muted-foreground">Last 105 Days</span>
      </div>

      <div className="space-y-1">
        {days.map((_, row) => (
          <div key={row} className="flex gap-1">
            {weeks.map((_, col) => {
              const level = (row + col * 3) % 5;

              const colors = [
                "bg-secondary",
                "bg-primary/20",
                "bg-primary/40",
                "bg-primary/70",
                "bg-primary",
              ];

              return (
                <div
                  key={col}
                  className={`h-4 w-4 rounded-sm ${colors[level]} transition hover:scale-125`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Less</span>

        <div className="flex gap-1">
          <div className="h-3 w-3 rounded bg-secondary" />
          <div className="h-3 w-3 rounded bg-primary/20" />
          <div className="h-3 w-3 rounded bg-primary/40" />
          <div className="h-3 w-3 rounded bg-primary/70" />
          <div className="h-3 w-3 rounded bg-primary" />
        </div>

        <span>More</span>
      </div>
    </section>
  );
}
