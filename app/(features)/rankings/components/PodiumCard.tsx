"use client";

import Image from "next/image";
import { Crown, Users } from "lucide-react";
import Link from "next/link";

import Rating from "@/components/ui/Rating";
import { getRankColor } from "@/lib/utils";

interface Props {
  rank: number;
  title: string;
  slug: string;
  cover: string;
  rating: number;
  readers: string;
}

export default function PodiumCard({
  rank,
  title,
  slug,
  cover,
  rating,
  readers,
}: Props) {
  const rankStyles: Record<
    number,
    {
      border: string;
      bg: string;
      crown: string;
      badge: string;
      height: string;
    }
  > = {
    1: {
      border: "border-yellow-400",
      bg: "from-yellow-500/20 to-transparent",
      crown: "text-yellow-400",
      badge: "bg-yellow-500 text-black",
      height: "mt-0",
    },
    2: {
      border: "border-slate-400",
      bg: "from-slate-500/15 to-transparent",
      crown: "text-slate-300",
      badge: "bg-slate-300 text-black",
      height: "mt-10",
    },
    3: {
      border: "border-orange-400",
      bg: "from-orange-500/15 to-transparent",
      crown: "text-orange-400",
      badge: "bg-orange-500 text-white",
      height: "mt-10",
    },
  };

  const style = rankStyles[rank] || rankStyles[1];

  return (
    <Link
      href={`/series/${slug}`}
      className={`relative overflow-hidden rounded-3xl border ${style.border} bg-gradient-to-b ${style.bg} bg-card p-6 ${style.height} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      {rank === 1 && (
        <div className="mb-3 flex justify-center">
          <Crown className={`h-8 w-8 ${style.crown}`} />
        </div>
      )}

      <div className="flex justify-center">
        <div
          className={`absolute left-5 top-5 rounded-full px-3 py-1 text-sm font-bold ${getRankColor(rank)}`}
        >
          #{rank}
        </div>

        <div className="relative h-52 w-40 overflow-hidden rounded-2xl">
          <Image src={cover} alt={title} fill className="object-cover" />
        </div>
      </div>

      <h3 className="mt-5 text-center text-xl font-bold line-clamp-2">
        {title}
      </h3>

      <div className="mt-4 flex items-center justify-center gap-5 text-sm">
        <Rating rating={rating} size="sm" />

        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="h-4 w-4" />
          {readers}
        </div>
      </div>
    </Link>
  );
}
