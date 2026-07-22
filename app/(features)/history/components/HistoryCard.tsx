"use client";

import Image from "next/image";
import Link from "next/link";

import { BadgeCheck, Star, Users, ArrowRight, Clock3 } from "lucide-react";

import { HistoryItem } from "./types";

interface Props {
  manga: HistoryItem;
}

export default function HistoryCard({ manga }: Props) {
  return (
    <article className="group flex items-center gap-6 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_25px_rgba(139,92,246,.18)]">
      {/* Cover */}

      <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Main */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-2xl font-bold">{manga.title}</h2>

          {manga.verified && (
            <BadgeCheck size={18} className="fill-primary text-primary" />
          )}
        </div>

        {/* Genres */}

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

        {/* Reading */}

        <div className="mt-5 flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 size={16} />

            {manga.lastRead}
          </div>

          <div className="text-primary">Chapter {manga.chapter}</div>

          <div className="text-muted-foreground">/ {manga.totalChapters}</div>
        </div>

        {/* Progress */}

        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${manga.progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs">
            <span className="text-muted-foreground">Reading Progress</span>

            <span className="text-primary">{manga.progress}%</span>
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="w-32 space-y-4">
        <div className="flex items-center gap-2">
          <Star size={18} className="fill-yellow-400 text-yellow-400" />

          <span>{manga.rating}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />

          {manga.readers}
        </div>
      </div>

      {/* Button */}

      <Link
        href={`/series/${manga.slug}/${manga.chapter}`}
        className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:scale-105 hover:bg-primary-hover"
      >
        <span className="flex items-center gap-2">
          Continue
          <ArrowRight size={16} />
        </span>
      </Link>
    </article>
  );
}
