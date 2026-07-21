"use client";

import { Crown, Sparkles } from "lucide-react";

export default function PremiumCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-indigo-700 p-6 text-white">
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/15 p-3">
            <Crown className="size-6" />
          </div>

          <h3 className="text-xl font-bold">ToonNest Premium</h3>
        </div>

        <p className="mt-5 text-sm leading-7 text-white/80">
          Sync your bookmarks across every device, unlock exclusive chapters and
          enjoy an ad-free reading experience.
        </p>

        <ul className="mt-6 space-y-3 text-sm">
          {["Unlimited Bookmarks", "Cloud Sync", "No Ads", "Early Access"].map(
            (item) => (
              <li key={item} className="flex items-center gap-2">
                <Sparkles size={16} />

                {item}
              </li>
            ),
          )}
        </ul>

        <button className="mt-8 w-full rounded-xl bg-white py-3 font-semibold text-primary transition hover:scale-[1.02]">
          Upgrade Now
        </button>
      </div>
    </section>
  );
}
