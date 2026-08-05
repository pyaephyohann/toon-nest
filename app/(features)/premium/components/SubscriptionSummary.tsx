"use client";

import { Subscription } from "@/store/api";
import { Crown, Calendar, RefreshCw, Settings, CreditCard, ChevronRight } from "lucide-react";
import { useCancelSubscriptionMutation, useToggleAutoRenewMutation, useUpgradeSubscriptionMutation } from "@/store/api";
import { useState } from "react";
import StatusBadge from "./StatusBadge";

interface Props {
  subscription: Subscription | null;
  isLoading?: boolean;
}

export default function SubscriptionSummary({ subscription, isLoading }: Props) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [toggleAutoRenew] = useToggleAutoRenewMutation();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div className="h-8 animate-pulse rounded-lg bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
          <div className="h-12 animate-pulse rounded-lg bg-muted" />
        </div>
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
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Free Plan</h3>
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

  const handleToggleAutoRenew = async () => {
    try {
      await toggleAutoRenew({ id: subscription.id, enabled: !subscription.autoRenew }).unwrap();
    } catch (error) {
      console.error("Failed to toggle auto-renew:", error);
    }
  };

  const planName = subscription.plan === "MONTHLY" ? "Premium Monthly" : subscription.plan === "YEARLY" ? "Premium Yearly" : subscription.plan;
  const billingInterval = subscription.plan === "MONTHLY" ? "Monthly" : subscription.plan === "YEARLY" ? "Yearly" : "N/A";
  const startDate = new Date(subscription.startsAt).toLocaleDateString();
  const endDate = new Date(subscription.expiresAt).toLocaleDateString();
  const remainingDays = Math.max(0, Math.ceil((new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercentage = Math.min(100, (remainingDays / 30) * 100);

  return (
    <div className="rounded-2xl border border-primary bg-primary/5 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
            <Crown className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-xl">{planName}</h3>
              <StatusBadge status={subscription.status} size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">{billingInterval} billing</p>
          </div>
        </div>
        <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Time Remaining</span>
            <span className="font-medium">{remainingDays} days</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="font-medium">{startDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">End Date</p>
            <p className="font-medium">{endDate}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <RefreshCw className={`h-5 w-5 ${subscription.autoRenew ? "text-primary" : "text-muted-foreground"}`} />
          <div>
            <p className="text-sm font-medium">Auto-renew</p>
            <p className="text-xs text-muted-foreground">
              {subscription.autoRenew ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleAutoRenew}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            subscription.autoRenew ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-1 transition-transform ${
              subscription.autoRenew ? "translate-x-6" : "translate-x-1"
            }`}
          >
            <div className="h-4 w-4 bg-background rounded-full shadow-sm" />
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border hover:bg-accent transition text-sm font-medium">
          <CreditCard className="h-4 w-4" />
          Manage
        </button>
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="flex items-center justify-center gap-2 p-3 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition text-sm font-medium"
        >
          Cancel
        </button>
      </div>

      {showCancelConfirm && (
        <div className="mt-4 rounded-xl bg-background p-4 border border-border">
          <p className="text-sm mb-4">
            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Subscription
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Keep Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
