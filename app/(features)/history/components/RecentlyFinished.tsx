"use client";

import Image from "next/image";
import Link from "next/link";
import { finishedSeries } from "./data";

export default function RecentlyFinished() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">Recently Finished</h3>

        <Link
          href="/completed"
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {finishedSeries.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 rounded-xl bg-background/50 p-2 transition hover:bg-secondary"
          >
            <div className="relative h-16 w-33 overflow-hidden rounded-md">
              <Image
                src={item.cover}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold">{item.title}</h4>

              <p className="text-xs text-emerald-400">✓ Completed</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
