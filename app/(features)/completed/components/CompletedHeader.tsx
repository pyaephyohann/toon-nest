"use client";

import { CheckCheck } from "lucide-react";

export default function CompletedHeader() {
  return (
    <header className="space-y-8">
      {/* Title */}
      <div className="flex items-center gap-5">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/15">
          <CheckCheck className="size-8 text-emerald-400" />
        </div>

        <div>
          <h1 className="text-5xl font-bold tracking-tight">Completed</h1>

          <p className="mt-2 text-muted-foreground">
            Finished series ready to binge from beginning to end.
          </p>
        </div>
      </div>
    </header>
  );
}
