"use client";

import { History } from "lucide-react";

export default function HistoryHeader() {
  return (
    <header className="space-y-8">
      {/* Title */}

      <div className="flex items-center gap-5">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15">
          <History className="size-8 text-primary" />
        </div>

        <div>
          <h1 className="text-5xl font-bold tracking-tight">Reading History</h1>

          <p className="mt-2 text-muted-foreground">
            Continue your reading journey from where you left off.
          </p>
        </div>
      </div>

      {/* Summary */}

      <div className="flex flex-wrap items-center gap-4">
        <div className="rounded-xl border border-border bg-card px-5 py-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Total History
          </p>

          <h3 className="mt-1 text-2xl font-bold">248 Chapters</h3>
        </div>

        <div className="rounded-xl border border-border bg-card px-5 py-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Reading Streak
          </p>

          <h3 className="mt-1 text-2xl font-bold text-emerald-400">32 Days</h3>
        </div>

        <div className="rounded-xl border border-border bg-card px-5 py-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Last Read
          </p>

          <h3 className="mt-1 text-2xl font-bold">10 mins ago</h3>
        </div>
      </div>
    </header>
  );
}
