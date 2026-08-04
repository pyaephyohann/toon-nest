"use client";

import { Subscription } from "@/store/api";
import { Crown, Calendar, X } from "lucide-react";
import { useCancelSubscriptionMutation } from "@/store/api";
import { useState } from "react";

interface Props {
  subscription: Subscription | null;
  isLoading?: boolean;
}

export default function CurrentSubscription({ subscription, isLoading }: Props) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelSubscription] = useCancelSubscriptionMutation();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Crown className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Free Plan</h3>
            <p className="text-sm text-muted-foreground">Upgrade to premium for full access</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCancel = async () => {
    try {
      await cancelSubscription(subscription.id).unwrap();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const planName = subscription.plan === "MONTHLY" ? "Premium Monthly" : subscription.plan === "YEARLY" ? "Premium Yearly" : subscription.plan;
  const expiresDate = new Date(subscription.expiresAt).toLocaleDateString();

  return (
    <div className="rounded-2xl border border-primary bg-primary/5 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Crown className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{planName}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Expires on {expiresDate}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition"
          title="Cancel subscription"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {showCancelConfirm && (
        <div className="mt-4 rounded-lg bg-background p-4 border border-border">
          <p className="text-sm mb-4">
            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Subscription
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Keep Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
