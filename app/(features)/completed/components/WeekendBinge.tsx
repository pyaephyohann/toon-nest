"use client";

import Link from "next/link";
import { Clock3, ArrowRight } from "lucide-react";

export default function WeekendBinge() {
  return (
    <section className="overflow-hidden rounded-3xl border border-completed/20 bg-gradient-to-br from-completed/20 via-card to-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-completed/20">
          <Clock3 className="size-6 text-completed" />
        </div>

        <div>
          <h3 className="text-xl font-bold">Weekend Binge</h3>

          <p className="text-sm text-muted-foreground">
            Complete in one weekend
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-2xl border border-completed/20 bg-background/50 p-5">
          <p className="text-sm text-muted-foreground">Recommended</p>

          <h2 className="mt-2 text-2xl font-bold">Solo Leveling</h2>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Time</p>

              <p className="mt-1 text-3xl font-bold text-completed">18 Hours</p>
            </div>
          </div>

          <Link
            href="/series/solo-leveling"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-completed py-3 font-semibold text-white transition hover:bg-completed-hover"
          >
            Start Reading
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
