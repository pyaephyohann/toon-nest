"use client";

import Image from "next/image";
import Link from "next/link";

import { Star, Users, BadgeCheck, ArrowRight, CircleCheck } from "lucide-react";

import { CompletedManga } from "./types";

interface Props {
  manga: CompletedManga;
}

export default function CompletedCard({ manga }: Props) {
  return (
    <article className="group flex items-center gap-6 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)]">
      {/* Rank */}
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ${
          manga.rank === 1
            ? "bg-linear-to-br from-yellow-300 to-yellow-500 text-black"
            : manga.rank === 2
              ? "bg-linear-to-br from-slate-200 to-slate-400 text-black"
              : manga.rank === 3
                ? "bg-linear-to-br from-orange-300 to-orange-500 text-white"
                : "bg-secondary text-foreground"
        }`}
      >
        {manga.rank}
      </div>

      {/* Cover */}
      <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-2xl font-bold">{manga.title}</h2>

          {manga.verified && (
            <BadgeCheck size={18} className="fill-primary text-primary" />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {manga.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-secondary px-3 py-1 text-xs"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-6">
          <div className="flex items-center gap-2 text-emerald-400">
            <CircleCheck size={18} />

            <span className="text-sm font-medium">Completed</span>
          </div>

          <span className="text-sm text-muted-foreground">
            {manga.chapters} Chapters
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-full rounded-full bg-emerald-500" />
          </div>

          <p className="mt-2 text-right text-xs text-emerald-400">100%</p>
        </div>
      </div>

      {/* Stats */}
      <div className="w-32 space-y-4">
        <div className="flex items-center gap-2">
          <Star size={18} className="fill-yellow-400 text-yellow-400" />

          <span className="font-semibold">{manga.rating}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />

          <span>{manga.readers}</span>
        </div>
      </div>

      {/* Read */}
      <Link
        href={`/series/${manga.slug}`}
        className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:scale-105 hover:bg-primary-hover"
      >
        <span className="flex items-center gap-2">
          Read Now
          <ArrowRight size={18} />
        </span>
      </Link>
    </article>
  );
}
