"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowRight, Crown } from "lucide-react";

import { PopularManga } from "./types";

interface Props {
  manga: PopularManga;
}

export default function TrendingHero({ manga }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-xl shadow-primary/10">
      <div className="relative h-96">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1 text-sm font-semibold text-white">
          <Flame size={16} />
          Trending Now
        </div>

        <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 shadow-lg">
          <Crown className="fill-black text-black" size={22} />
        </div>

        <div className="absolute bottom-0 w-full p-6">
          <div className="text-sm font-medium text-primary">#1 THIS WEEK</div>

          <h2 className="mt-2 text-3xl font-bold">{manga.title}</h2>

          <div className="mt-3 flex items-center gap-5 text-sm text-muted-foreground">
            ⭐ {manga.rating}
            👥 {manga.readers}
          </div>

          <Link
            href={`/series/${manga.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
          >
            Read Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
