"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Genre } from "./types";
import ProgressBar from "@/components/ui/ProgressBar";

interface Props {
  genre: Genre;
}

export default function GenreCard({ genre }: Props) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={genre.cover}
          alt={genre.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black/50 text-2xl backdrop-blur">
          {genre.icon}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">{genre.name}</h3>

          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {genre.seriesCount.toLocaleString()} Series
        </p>

        <ProgressBar
          progress={Math.min(genre.seriesCount / 25, 100)}
          showLabel={false}
          size="md"
          customColor={genre.color}
        />
      </div>
    </Link>
  );
}
