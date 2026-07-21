"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  MoreVertical,
  Star,
  Users,
} from "lucide-react";

import { BookmarkManga } from "./types";

interface Props {
  manga: BookmarkManga;
}

export default function BookmarkCard({ manga }: Props) {
  const rankColor =
    manga.rank === 1
      ? "from-yellow-300 to-yellow-500 text-black shadow-yellow-500/40"
      : manga.rank === 2
        ? "from-slate-200 to-slate-400 text-black shadow-slate-400/40"
        : manga.rank === 3
          ? "from-orange-300 to-orange-500 text-white shadow-orange-500/40"
          : "bg-secondary text-white";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_35px_rgba(139,92,246,.18)]">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-center gap-6 p-5">
        {/* Rank */}
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold shadow-xl ${rankColor}`}
        >
          {manga.rank}
        </div>

        {/* Cover */}
        <div className="relative h-32 w-52 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={manga.cover}
            alt={manga.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="flex items-center gap-2">
            <h2 className="truncate text-3xl font-bold">{manga.title}</h2>

            {manga.verified && (
              <BadgeCheck size={20} className="fill-primary text-primary" />
            )}
          </div>

          {/* Genres */}
          <div className="mt-4 flex flex-wrap gap-2">
            {manga.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen size={15} />
                Chapter {manga.chapter}
              </span>

              <span className="font-semibold text-primary">
                {manga.progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${manga.progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden w-36 space-y-5 lg:block">
          <div className="flex items-center gap-2">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />

            <span className="font-semibold">{manga.rating}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={17} />

            <span>{manga.readers}</span>
          </div>

          <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
            {manga.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex f items-end gap-3">
          <Link
            href={`/series/${manga.slug}/${manga.chapter}`}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:scale-105 hover:bg-primary-hover"
          >
            Continue
            <ArrowRight size={18} />
          </Link>

          <button className="rounded-xl border border-border bg-secondary p-3 transition hover:border-primary hover:text-primary">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
