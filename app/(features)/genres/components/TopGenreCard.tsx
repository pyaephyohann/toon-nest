"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

interface Props {
  title: string;
  image: string;
  description: string;
  series: number;
}

export default function TopGenreCard({
  title,
  image,
  description,
  series,
}: Props) {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-border">
      <div className="relative h-[320px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20" />

        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <span className="mb-4 flex w-fit items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm text-primary backdrop-blur">
            <TrendingUp size={16} />
            Featured Genre
          </span>

          <h1 className="text-5xl font-bold">{title}</h1>

          <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>

          <div className="mt-8 flex items-center gap-6">
            <span className="text-lg font-semibold">
              {series.toLocaleString()} Series
            </span>

            <Link
              href="/browse"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium transition hover:bg-primary-hover"
            >
              Explore
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
