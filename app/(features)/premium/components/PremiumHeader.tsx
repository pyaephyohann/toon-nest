"use client";

import { Crown } from "lucide-react";

export default function PremiumHeader() {
  return (
    <header className="space-y-8">
      {/* Title */}

      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
          <Crown size={34} className="fill-primary text-primary" />
        </div>

        <div>
          <h1 className="text-5xl font-bold tracking-tight">Go Premium</h1>

          <p className="mt-2 text-muted-foreground">
            Unlock exclusive features and enjoy the best reading experience.
          </p>
        </div>
      </div>
    </header>
  );
}
