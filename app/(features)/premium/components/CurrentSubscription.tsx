"use client";

import { Subscription } from "@/store/api";
import { Crown, Calendar, X, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useCancelSubscriptionMutation, useToggleAutoRenewMutation, useUpgradeSubscriptionMutation } from "@/store/api";
import { useState } from "react";

interface Props {
  subscription: Subscription | null;
  isLoading?: boolean;
}

export default function CurrentSubscription({ subscription, isLoading }: Props) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [toggleAutoRenew] = useToggleAutoRenewMutation();
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();

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

  const handleToggleAutoRenew = async () => {
    try {
      await toggleAutoRenew({ id: subscription.id, enabled: !subscription.autoRenew }).unwrap();
    } catch (error) {
      console.error("Failed to toggle auto-renew:", error);
    }
  };

  const handleUpgrade = async (newPlan: string) => {
    try {
      await upgradeSubscription({ id: subscription.id, newPlan }).unwrap();
      setShowUpgradeMenu(false);
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    }
  };

  const planName = subscription.plan === "MONTHLY" ? "Premium Monthly" : subscription.plan === "YEARLY" ? "Premium Yearly" : subscription.plan;
  const status = subscription.status === "ACTIVE" ? "Active" : subscription.status === "CANCELLED" ? "Cancelled" : subscription.status === "EXPIRED" ? "Expired" : subscription.status;
  const statusColor = subscription.status === "ACTIVE" ? "text-green-600 bg-green-500/10" : subscription.status === "CANCELLED" ? "text-yellow-600 bg-yellow-500/10" : "text-red-600 bg-red-500/10";
  const billingInterval = subscription.plan === "MONTHLY" ? "Monthly" : subscription.plan === "YEARLY" ? "Yearly" : "N/A";
  const startDate = new Date(subscription.startsAt).toLocaleDateString();
  const endDate = new Date(subscription.expiresAt).toLocaleDateString();
  const remainingDays = Math.max(0, Math.ceil((new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="rounded-2xl border border-primary bg-primary/5 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Crown className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{planName}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
                {status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {billingInterval} billing
              </span>
              <span>{remainingDays} days remaining</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpgradeMenu(!showUpgradeMenu)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition"
            title="Upgrade/Downgrade"
          >
            <ArrowUpRight className="h-5 w-5" />
          </button>
          <button
            onClick={handleToggleAutoRenew}
            className={`rounded-lg p-2 transition ${subscription.autoRenew ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-accent"}`}
            title={subscription.autoRenew ? "Disable auto-renew" : "Enable auto-renew"}
          >
            <RefreshCw className={`h-5 w-5 ${subscription.autoRenew ? "" : "opacity-50"}`} />
          </button>
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition"
            title="Cancel subscription"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Start Date</p>
          <p className="font-medium">{startDate}</p>
        </div>
        <div>
          <p className="text-muted-foreground">End Date</p>
          <p className="font-medium">{endDate}</p>
        </div>
      </div>

      {showUpgradeMenu && (
        <div className="mt-4 rounded-lg bg-background p-4 border border-border">
          <p className="text-sm font-medium mb-3">Change Plan</p>
          <div className="space-y-2">
            {subscription.plan !== "MONTHLY" && (
              <button
                onClick={() => handleUpgrade("MONTHLY")}
                className="w-full flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent transition"
              >
                <span>Switch to Monthly</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            )}
            {subscription.plan !== "YEARLY" && (
              <button
                onClick={() => handleUpgrade("YEARLY")}
                className="w-full flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent transition"
              >
                <span>Switch to Yearly (Save 20%)</span>
                <ArrowDownRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

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
