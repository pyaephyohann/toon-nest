"use client";

import Image from "next/image";
import { ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

import { trendingData } from "./data";

export default function TrendingSidebar() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">🔥 Trending Right Now</h2>

      <div className="mt-6 space-y-4">
        {trendingData.map((manga) => (
          <Link
            key={manga.rank}
            href={`/series/${manga.slug}`}
            className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3 transition hover:bg-secondary"
          >
            <div className="text-lg font-bold text-primary w-5">
              {manga.rank}
            </div>

            <div className="relative h-14 w-10 overflow-hidden rounded-lg">
              <Image
                src={manga.cover}
                alt={manga.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{manga.title}</p>
            </div>

            {manga.change === "up" ? (
              <ArrowUp className="text-emerald-400" size={18} />
            ) : (
              <ArrowDown className="text-red-400" size={18} />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
