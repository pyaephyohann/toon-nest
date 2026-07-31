"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
import Link from "next/link";

import Rating from "@/components/ui/Rating";

interface Props {
  title: string;
  slug: string;
  cover: string;
  subtitle: string;
  rating: number;
}

export default function HallOfFameCard({
  title,
  slug,
  cover,
  subtitle,
  rating,
}: Props) {
  return (
    <Link
      href={`/series/${slug}`}
      className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_30px_rgba(139,92,246,.25)]"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute left-5 top-5 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">
          Hall of Fame
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />

          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        <p className="text-sm text-muted-foreground">{subtitle}</p>

        <Rating rating={rating} size="sm" />
      </div>
    </Link>
  );
}
