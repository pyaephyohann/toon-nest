"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";

import { PopularManga } from "./types";

interface Props {
  manga: PopularManga;
}

export default function TrendingMiniCard({ manga }: Props) {
  return (
    <Link
      href={`/series/${manga.slug}`}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-primary hover:bg-secondary"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-xl">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold">{manga.title}</h4>

        <p className="mt-1 text-xs text-muted-foreground">
          {manga.readers} Readers
        </p>
      </div>

      <div
        className={`flex items-center gap-1 text-sm font-semibold ${
          manga.trend >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {manga.trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}

        {Math.abs(manga.trend)}
      </div>
    </Link>
  );
}
