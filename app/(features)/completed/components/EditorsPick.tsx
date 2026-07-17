"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, BadgeCheck } from "lucide-react";

import { CompletedManga } from "./types";

interface Props {
  manga: CompletedManga;
}

export default function EditorsPick({ manga }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative h-80">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute left-5 top-5 rounded-full bg-completed px-4 py-1 text-xs font-semibold text-white">
          Editor's Pick
        </div>

        <div className="absolute bottom-0 w-full p-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{manga.title}</h2>

            {manga.verified && (
              <BadgeCheck size={18} className="fill-primary text-primary" />
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />

            <span>{manga.rating}</span>
          </div>

          <Link
            href={`/series/${manga.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-hover"
          >
            Read Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
