"use client";

import Link from "next/link";
import { Crown, Check, Sparkles } from "lucide-react";

interface Props {
  title: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
}

export default function PremiumCard({
  title,
  price,
  period,
  popular,
  features,
}: Props) {
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-card p-8 transition-all duration-300 hover:-translate-y-2 ${
        popular
          ? "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.18)]"
          : "border-border hover:border-primary hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]"
      }`}
    >
      {popular && (
        <span className="absolute right-5 top-5 rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-black">
          MOST POPULAR
        </span>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`rounded-xl p-3 ${
            popular ? "bg-yellow-500/20" : "bg-primary/20"
          }`}
        >
          {popular ? (
            <Crown className="fill-yellow-400 text-yellow-400" />
          ) : (
            <Sparkles className="text-primary" />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{title}</h2>

          <p className="text-muted-foreground">Perfect for binge readers</p>
        </div>
      </div>

      <div className="mt-8">
        <span className="text-5xl font-bold">{price}</span>

        <span className="ml-2 text-muted-foreground">/ {period}</span>
      </div>

      <div className="mt-8 space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/20 p-1">
              <Check size={14} className="text-emerald-400" />
            </div>

            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Link
        href="/checkout"
        className={`mt-10 flex h-14 items-center justify-center rounded-2xl font-semibold transition ${
          popular
            ? "bg-yellow-400 text-black hover:bg-yellow-300"
            : "bg-primary text-white hover:bg-primary-hover"
        }`}
      >
        Upgrade Now
      </Link>
    </article>
  );
}
