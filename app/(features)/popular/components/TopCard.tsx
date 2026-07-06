"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

import { PopularManga } from "./types";

interface Props {
  manga: PopularManga;
}

export default function TopCard({ manga }: Props) {
  const cardStyle =
    manga.rank === 1
      ? {
          border: "border-yellow-500",
          glow: "hover:shadow-[0_0_40px_rgba(234,179,8,0.45)]",
        }
      : manga.rank === 2
        ? {
            border: "border-slate-400",
            glow: "hover:shadow-[0_0_35px_rgba(203,213,225,0.35)]",
          }
        : {
            border: "border-orange-500",
            glow: "hover:shadow-[0_0_35px_rgba(249,115,22,0.4)]",
          };

  return (
    <div
      className={`group overflow-hidden rounded-3xl border bg-card
    ${cardStyle.border}
    transition-all duration-500
    hover:-translate-y-3
    hover:scale-[1.02]
    ${cardStyle.glow}`}
    >
      {/* Image */}

      <div className="relative h-96">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Rank */}

        <div
          className={`absolute left-5 top-5 flex size-14 items-center justify-center rounded-2xl text-2xl font-bold ${
            manga.rank === 1
              ? "bg-yellow-500 text-black"
              : manga.rank === 2
                ? "bg-slate-300 text-black"
                : "bg-orange-500 text-white"
          }`}
        >
          {manga.rank}
        </div>

        {/* Bottom */}

        <div className="absolute bottom-0 w-full p-6">
          <h2 className="text-3xl font-bold">{manga.title}</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {manga.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-black/50 px-3 py-1 text-xs backdrop-blur"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />

                <span>{manga.rating}</span>
              </div>

              <p className="text-sm text-muted-foreground">
                {manga.readers} Readers
              </p>
            </div>

            <Link
              href={`/series/${manga.slug}`}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium transition hover:bg-primary-hover"
            >
              Read Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
