"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Star } from "lucide-react";

import { PopularManga } from "./types";

interface Props {
  manga: PopularManga;
}

export default function RankingCard({ manga }: Props) {
  return (
    <div className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
      {/* Rank */}
      <div className="flex w-14 justify-center">
        <span className="text-3xl font-bold text-primary">#{manga.rank}</span>
      </div>

      {/* Cover */}
      <div className="relative h-24 w-44 overflow-hidden rounded-xl">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          sizes="176px"
          className="object-cover transition-all duration-500 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{manga.title}</h3>

        <div className="mt-2 flex flex-wrap gap-2">
          {manga.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-secondary px-2 py-1 text-xs"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />
            {manga.rating}
          </div>

          <div className="flex items-center gap-1">
            <Eye size={15} />
            {manga.readers}
          </div>

          <span>Chapter {manga.chapters}</span>
        </div>
      </div>

      {/* Button */}
      <Link
        href={`/series/${manga.slug}`}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-hover"
      >
        Read
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
