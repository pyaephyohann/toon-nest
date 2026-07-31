"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ViewAllGenres() {
  return (
    <section className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 p-8">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold">
          Can't Find What You're Looking For?
        </h2>

        <p className="mt-3 max-w-xl text-muted-foreground">
          Explore our complete library of genres, themes, tags, and collections
          to discover thousands of amazing stories.
        </p>

        <Link
          href="/browse"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:bg-primary-hover"
        >
          View All Genres
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
