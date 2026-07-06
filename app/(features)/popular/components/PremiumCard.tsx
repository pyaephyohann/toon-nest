"use client";

import { Crown } from "lucide-react";

export default function PremiumCard() {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
          <Crown className="fill-yellow-300 text-yellow-300" />
        </div>

        <h3 className="text-xl font-bold">ToonNest Premium</h3>
      </div>

      <p className="mt-4 text-sm text-white/80">
        Unlock ad-free reading, early chapters, HD images and exclusive content.
      </p>

      <button className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-primary transition hover:bg-white/90">
        Upgrade Now
      </button>
    </div>
  );
}
