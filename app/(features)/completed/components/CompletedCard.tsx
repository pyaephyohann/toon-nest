"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Star,
  Users,
  BadgeCheck,
  ArrowRight,
  CircleCheck,
  Eye,
} from "lucide-react";

import { CompletedManga } from "./types";

interface Props {
  manga: CompletedManga;
}

export default function CompletedCard({ manga }: Props) {
  return (
    <article className="group flex items-center gap-6 rounded-2xl border border-border bg-gradient-to-br from-card to-card/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:shadow-emerald-500/10">
      {/* Rank */}
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-110 ${
          manga.rank === 1
            ? "bg-linear-to-br from-yellow-300 to-yellow-500 text-black shadow-yellow-500/30"
            : manga.rank === 2
              ? "bg-linear-to-br from-slate-200 to-slate-400 text-black shadow-slate-400/30"
              : manga.rank === 3
                ? "bg-linear-to-br from-orange-300 to-orange-500 text-white shadow-orange-500/30"
                : "bg-secondary text-foreground"
        }`}
      >
        {manga.rank}
      </div>

      {/* Cover */}
      <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-xl font-bold transition-colors group-hover:text-emerald-400">
            {manga.title}
          </h2>

          {manga.verified && (
            <BadgeCheck
              size={18}
              className="fill-emerald-400 text-emerald-400"
            />
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {manga.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-secondary/80 px-3 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-secondary"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CircleCheck size={16} className="fill-emerald-400/20" />
            <span className="text-xs font-medium">Completed</span>
          </div>

          <span className="text-xs text-muted-foreground">
            {manga.chapters} Chapters
          </span>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
          </div>

          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-400">100%</span>
            <span className="text-muted-foreground/60">Complete</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-3 py-1.5">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-yellow-400">{manga.rating}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground/80">
          <Users size={14} />
          <span className="text-sm">{manga.readers}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <Eye size={14} />
          <span className="text-xs">2.6M</span>
        </div>
      </div>

      {/* Read Button */}
      <Link
        href={`/series/${manga.slug}`}
        className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30"
      >
        <span className="relative z-10 flex items-center gap-2">
          Read Now
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        </span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-0" />
      </Link>
    </article>
  );
}
