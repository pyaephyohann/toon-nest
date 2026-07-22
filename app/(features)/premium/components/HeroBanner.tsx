"use client";

import Image from "next/image";

import { ShieldCheck, Download, Zap, Sparkles } from "lucide-react";

const perks = [
  {
    icon: ShieldCheck,
    title: "Ad-Free",
    subtitle: "Reading",
  },
  {
    icon: Zap,
    title: "Early Access",
    subtitle: "to Chapters",
  },
  {
    icon: Download,
    title: "Offline",
    subtitle: "Reading",
  },
  {
    icon: Sparkles,
    title: "High Quality",
    subtitle: "Experience",
  },
];

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-[#1b1035] via-[#25104f] to-[#140d2c]">
      {/* Background Image */}

      <Image
        src="/covers/premium-banner.jpg"
        alt="Premium"
        fill
        className="object-cover opacity-35"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

      <div className="relative z-10 flex min-h-[260px] items-center justify-between gap-10 p-10">
        {/* Left */}

        <div className="max-w-xl">
          <span className="inline-flex rounded-full bg-primary/20 px-4 py-1 text-sm text-primary">
            👑 Premium Only
          </span>

          <h2 className="mt-5 text-5xl font-bold leading-tight">
            Unlimited Stories,
            <br />
            <span className="text-primary">Zero Limits.</span>
          </h2>

          <p className="mt-5 text-muted-foreground">
            Read more. Wait less. Enjoy the ultimate ToonVerse experience with
            exclusive premium features.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {perks.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur"
              >
                <item.icon size={18} className="text-primary" />

                <div>
                  <p className="text-sm font-semibold">{item.title}</p>

                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Character */}

        <div className="hidden lg:block">
          <Image
            src="/covers/solo-premium.png"
            alt="Premium"
            width={450}
            height={520}
            className="drop-shadow-[0_0_80px_rgba(139,92,246,.55)]"
          />
        </div>
      </div>
    </section>
  );
}
