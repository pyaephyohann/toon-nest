"use client";

import { Lock, Crown, Check } from "lucide-react";
import Link from "next/link";
import PremiumBadge from "../ui/PremiumBadge";

interface Props {
  chapterTitle?: string;
  seriesSlug?: string;
}

export default function LockedChapter({ chapterTitle, seriesSlug }: Props) {
  const premiumFeatures = [
    "Unlimited manga access",
    "High-quality images",
    "Early chapter releases",
    "Ad-free experience",
    "Offline reading",
    "Bookmark sync",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-2xl">
        {/* Lock Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">Premium Chapter</h2>
        <p className="text-muted-foreground mb-8">
          This chapter requires a premium subscription to read
        </p>

        {/* Premium Badge */}
        <div className="flex justify-center mb-8">
          <PremiumBadge type="locked" size="lg" />
        </div>

        {/* Premium Features */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Premium Benefits</h3>
          </div>
          <ul className="space-y-3 text-left">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/premium"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            <Crown className="h-5 w-5" />
            Upgrade to Premium
          </Link>
          {seriesSlug && (
            <Link
              href={`/series/${seriesSlug}`}
              className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 font-medium hover:bg-accent transition"
            >
              Back to Series
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
