"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
      "A popular action-fantasy webnovel and manhwa that follows Kang Jinhyuk, a hardcore gaming streamer who is the only person to ever beat the Tower of Trials.",
    image: "/banners/solo-max-level-newbie.png",
    genres: ["Action", "Fantasy", "Game"],
    style: "action",
  },
  {
    id: "2",
    title: "The Beginning After The End",
    description:
      "Reborn as Arthur Leywin, a former king begins a second life in a magical world where he seeks to protect those he loves.",
    image: "/banners/the-beginning-after-the-end.jpeg",
    genres: ["Fantasy", "Adventure", "Magic"],
    style: "romance",
  },
  {
    id: "3",
    title: "A Returner's Magic Should Be Special",
    description:
      "Desir Arman returns to the past to save humanity before the Shadow World destroys everything.",
    image: "/banners/a-returners-magic-should-be-special.jpg",
    genres: ["Action", "Fantasy"],
    style: "action",
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function HeroCarousel() {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const banner = banners[current];

  const paginate = useCallback((newDirection: number) => {
    setCurrent(([prev]) => [
      (prev + newDirection + banners.length) % banners.length,
      newDirection,
    ]);
  }, []);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [paused, paginate, current]);

  return (
    <section
      className="group relative overflow-hidden rounded-3xl border border-border bg-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-112.5 overflow-hidden">
        <AnimatePresence custom={direction}>
          <motion.div
            key={banner.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{
                delay: 0.15,
                duration: 0.45,
              }}
              className="absolute inset-0 flex items-center px-16"
            >
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

                <p className="mb-8 max-w-lg leading-7 text-gray-300">
                  {banner.description}
                </p>

                <div className="flex gap-4">
                  <button className="rounded-xl bg-primary px-7 py-3 font-semibold text-white transition hover:bg-primary-hover">
                    Read Now
                  </button>

                  <button className="rounded-xl border border-white/20 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                    + My List
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => paginate(-1)}
          className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:bg-primary"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:bg-primary"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent([index, index > current ? 1 : -1])}
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
