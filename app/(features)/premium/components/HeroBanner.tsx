"use client";

import Image from "next/image";
import { Crown, Download, Zap, Shield, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Crown,
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
    icon: Shield,
    title: "High Quality",
    subtitle: "Experience",
  },
];

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden p-4 rounded-3xl border border-primary/20">
      {/* Background */}

      <Image
        src="/series/solo-leveling.jpeg"
        alt="Premium Banner"
        fill
        priority
        className="object-cover transition duration-700 hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#14071f] via-[#170927]/80 to-transparent" />

      <div className="relative flex min-h-[360px] items-center px-10">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm text-primary">
            <Crown size={14} />
            Premium Only
          </span>

          <h2 className="mt-8 text-6xl font-extrabold leading-tight">
            Unlimited Stories,
            <br />
            <span className="text-primary">Zero Limits.</span>
          </h2>

          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Read more. Wait less. Enjoy the ultimate ToonVerse experience.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md transition hover:border-primary/50 hover:bg-primary/10"
                >
                  <Icon size={22} className="mb-3 text-primary" />

                  <h3 className="text-sm font-semibold">{item.title}</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
