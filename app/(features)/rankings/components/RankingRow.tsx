"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUp, ArrowDown, Users, BadgeCheck } from "lucide-react";
import { RankingManga } from "./types";

import Rating from "@/components/ui/Rating";
import { getRankColor } from "@/utils";
import Badge from "@/components/ui/Badge";

interface Props {
  manga: RankingManga;
}

export default function RankingRow({ manga }: Props) {
  return (
    <Link
      href={`/series/${manga.slug}`}
      className="group flex items-center gap-5 border-b border-border p-5 transition-all hover:bg-secondary/30 last:border-none"
    >
      {/* Rank */}
      <div className="w-12 text-center">
        <span className={`text-2xl font-bold ${getRankColor(manga.rank)}`}>
          #{manga.rank}
        </span>
      </div>

      {/* Cover */}
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold">{manga.title}</h3>

          {manga.verified && (
            <BadgeCheck size={16} className="fill-primary text-primary" />
          )}
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{manga.author}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {manga.genres.map((genre) => (
            <Badge key={genre} variant="default" size="sm">
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="hidden w-24 items-center gap-2 md:flex">
        <Rating rating={manga.rating} size="sm" />
      </div>

      {/* Readers */}
      <div className="hidden w-28 items-center gap-2 lg:flex">
        <Users size={16} />

        <span>{manga.readers}</span>
      </div>

      {/* Trend */}
      <div className="w-20">
        <div
          className={`flex items-center justify-center gap-1 rounded-full px-3 py-1 text-sm ${
            manga.trend >= 0
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {manga.trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}

          {Math.abs(manga.trend)}
        </div>
      </div>
    </Link>
  );
}
