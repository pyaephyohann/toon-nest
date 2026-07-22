"use client";

import { Star, ArrowRight } from "lucide-react";

export default function LoyaltyBanner() {
  return (
    <section className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent">
      <div className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
            <Star size={30} className="fill-yellow-400 text-yellow-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Premium Loyalty Rewards</h2>

            <p className="mt-2 text-muted-foreground">
              Stay longer and unlock exclusive rewards, profile badges,
              discounts and early beta access.
            </p>
          </div>
        </div>

        <button className="rounded-xl bg-primary px-7 py-3 font-medium text-white transition hover:bg-primary-hover hover:shadow-[0_0_25px_rgba(139,92,246,.35)]">
          <span className="flex items-center gap-2">
            Learn More
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </section>
  );
}
