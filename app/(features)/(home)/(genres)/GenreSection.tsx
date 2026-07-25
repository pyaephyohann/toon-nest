"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import GenreCard from "./GenreCard";
import { Genre } from "./types";

interface Props {
  title: string;
  items: Genre[];
}

export default function GenreSection({ title, items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left: direction === "right" ? 400 : -400,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-xl border border-border bg-card p-2 transition hover:bg-primary hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="rounded-xl border border-border bg-card p-2 transition hover:bg-primary hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex gap-4 scroll-smooth no-scrollbar">
        {items.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </div>
    </section>
  );
}
