"use client";

import Image from "next/image";
import Link from "next/link";

import Rating from "@/components/ui/Rating";

const series = [
  {
    title: "Solo Leveling",
    image: "/covers/solo-leveling.jpg",
    rating: 4.9,
  },
  {
    title: "Nano Machine",
    image: "/covers/nano-machine.jpg",
    rating: 4.8,
  },
  {
    title: "The Beginning After The End",
    image: "/covers/tbate.jpg",
    rating: 4.8,
  },
  {
    title: "Omniscient Reader",
    image: "/covers/orv.jpg",
    rating: 4.9,
  },
];

export default function PopularSeries() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Popular Series</h2>

      <div className="mt-6 space-y-5">
        {series.map((item) => (
          <Link
            key={item.title}
            href="/"
            className="group flex items-center gap-4"
          >
            <div className="relative h-20 w-16 overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition group-hover:scale-110"
              />
            </div>

            <div className="flex-1">
              <h3 className="line-clamp-1 font-semibold group-hover:text-primary">
                {item.title}
              </h3>

              <div className="mt-2">
                <Rating rating={item.rating} size="sm" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
