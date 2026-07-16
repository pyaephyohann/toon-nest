"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Star,
  Users,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  BadgeCheck,
  Flame,
} from "lucide-react";

import RankBadge from "./RankBadge";
import { PopularManga } from "./types";

interface Props {
  manga: PopularManga;
}

export default function TrendingCard({ manga }: Props) {
  return (
    <article className="group flex items-center gap-6 rounded-3xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
      {/* Rank */}

      <RankBadge rank={manga.rank} />

      {/* Cover */}

      <div className="relative h-28 w-44 overflow-hidden rounded-2xl">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      {/* Info */}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{manga.title}</h2>

          <BadgeCheck size={18} className="fill-primary text-primary" />

          {manga.isHot && (
            <div className="ml-3 flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 text-xs font-medium text-red-400">
              <Flame size={12} />
              Hot
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {manga.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-secondary px-3 py-1 text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}

      <div className="space-y-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />

          <span>{manga.rating}</span>
        </div>

        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <Users size={15} />

          {manga.readers}
        </div>

        <div
          className={`flex items-center justify-end gap-1 text-sm font-semibold ${
            manga.trend >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {manga.trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}

          {Math.abs(manga.trend)}
        </div>
      </div>

      {/* Button */}

      <Link
        href={`/series/${manga.slug}`}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-hover"
      >
        Read Now
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}
