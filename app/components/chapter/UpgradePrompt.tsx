"use client";

import { Crown, X, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  onClose?: () => void;
  showClose?: boolean;
}

export default function UpgradePrompt({ onClose, showClose = true }: Props) {
  const premiumFeatures = [
    "Unlimited manga access",
    "High-quality images",
    "Early chapter releases",
    "Ad-free experience",
    "Offline reading",
    "Bookmark sync",
  ];

  if (onClose === undefined) {
    // If no onClose provided, don't render (controlled by parent)
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 relative">
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent transition"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
          <p className="text-sm text-muted-foreground">
            Unlock this chapter and get access to all premium features
          </p>
        </div>

        <div className="bg-muted rounded-xl p-4 mb-6">
          <h4 className="font-semibold mb-3 text-sm">Premium Benefits</h4>
          <ul className="space-y-2">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/premium"
            onClick={onClose}
            className="block w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            <Crown className="h-5 w-5" />
            View Plans
          </Link>
          <button
            onClick={onClose}
            className="block w-full rounded-xl border border-border px-4 py-3 font-medium hover:bg-accent transition"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
