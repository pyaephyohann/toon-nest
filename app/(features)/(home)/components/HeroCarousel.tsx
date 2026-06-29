"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BannerStyle = "dark-fantasy" | "romance" | "action" | "cinematic";

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  genres: string[];
  style: BannerStyle;
}

const banners: Banner[] = [
  {
    id: "1",
    title: "Solo Max Level Newbie",
    description:
      "A popular action-fantasy webnovel and manhwa that follows Kang Jinhyuk, a hardcore gaming streamer who is the only person to ever beat a notorious, game-like reality called the Tower of Trials.",
    image: "/banners/solo-max-level-newbie.png",
    genres: ["Action", "Fantasy", "Game"],
    style: "action",
  },
  {
    id: "2",
    title: "The Beginning After The End",
    description:
      "Reborn as Arthur Leywin after a mysterious demise, a former king retains his wisdom despite entering a new life as a baby on the magical continent of Dicathen. He masters magic, forging his path to rectify past mistakes.",
    image: "/banners/the-beginning-after-the-end.jpeg",
    genres: ["Fantasy", "Adventure", "Magic"],
    style: "romance",
  },
  {
    id: "3",
    title: "A Returner's Magic Should Be Special",
    description:
      "The strongest magician returns to save humanity before disaster strikes again.",
    image: "/banners/a-returners-magic-should-be-special.jpg",
    genres: ["Action", "Fantasy"],
    style: "action",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const banner = banners[current];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [current, paused, next]);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative h-112.5">
        <Image
          key={banner.id}
          src={banner.image}
          alt={banner.title}
          fill
          priority
          className="animate-fade object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

        <div className="absolute inset-0 flex items-center px-16">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
              🔥 #1 Trending
            </div>

            <h1 className="mb-5 text-5xl font-bold leading-tight text-white">
              {banner.title}
            </h1>

            <div className="mb-5 flex flex-wrap gap-2">
              {banner.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="mb-8 max-w-lg leading-7 text-muted-foreground">
              {banner.description}
            </p>

            <div className="flex gap-4">
              <button className="rounded-xl bg-primary px-7 py-3 font-semibold text-white transition hover:bg-primary-hover">
                Read Now
              </button>

              <button className="rounded-xl border border-border bg-card/80 px-7 py-3 font-semibold backdrop-blur transition hover:bg-card">
                + My List
              </button>
            </div>
          </div>
        </div>

        {/* Previous */}
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-primary"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next */}
        <button
          onClick={next}
          className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-primary"
        >
          <ChevronRight size={22} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
