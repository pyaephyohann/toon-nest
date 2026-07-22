"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function ResumeJourney() {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-indigo-700 p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/15 p-3">
          <BookOpen size={22} />
        </div>

        <h3 className="text-xl font-bold">Resume Journey</h3>
      </div>

      <p className="mt-5 text-sm leading-7 text-white/80">
        Pick up exactly where you stopped reading. Never lose your progress
        again.
      </p>

      <div className="mt-8 rounded-xl bg-white/10 p-4 backdrop-blur">
        <p className="text-sm text-white/70">Last Read</p>

        <h4 className="mt-2 text-lg font-bold">Solo Necromancer</h4>

        <p className="mt-1 text-sm text-white/80">Chapter 182 • 73% Complete</p>
      </div>

      <Link
        href="/series/solo-necromancer/182"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-primary transition hover:scale-[1.03]"
      >
        Continue Reading
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}
