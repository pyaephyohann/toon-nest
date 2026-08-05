"use client";

import { Subscription } from "@/store/api";
import { Crown, Calendar, X, RefreshCw, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import { useCancelSubscriptionMutation, useToggleAutoRenewMutation, useUpgradeSubscriptionMutation } from "@/store/api";
import { useState } from "react";
import StatusBadge from "./StatusBadge";

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
  const billingInterval = subscription.plan === "MONTHLY" ? "Monthly" : subscription.plan === "YEARLY" ? "Yearly" : "N/A";
  const startDate = new Date(subscription.startsAt).toLocaleDateString();
  const endDate = new Date(subscription.expiresAt).toLocaleDateString();
  const remainingDays = Math.max(0, Math.ceil((new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case "MONTHLY":
        return "$9.99/month";
      case "YEARLY":
        return "$99.99/year";
      default:
        return "N/A";
    }
  };

  const getProratedAmount = (currentPlan: string, newPlan: string) => {
    // Placeholder for prorated calculation
    if (currentPlan === "MONTHLY" && newPlan === "YEARLY") {
      return "$89.99 (prorated)";
    }
    if (currentPlan === "YEARLY" && newPlan === "MONTHLY") {
      return "$9.99/month";
    }
    return getPlanPrice(newPlan);
  };

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
              <StatusBadge status={subscription.status} size="sm" />
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
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Change Plan</p>
          </div>
          
          <div className="space-y-3">
            {subscription.plan !== "MONTHLY" && (
              <button
                onClick={() => handleUpgrade("MONTHLY")}
                className="w-full flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-accent transition"
              >
                <div className="text-left">
                  <p className="font-medium">Switch to Monthly</p>
                  <p className="text-xs text-muted-foreground">{getProratedAmount(subscription.plan, "MONTHLY")}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            {subscription.plan !== "YEARLY" && (
              <button
                onClick={() => handleUpgrade("YEARLY")}
                className="w-full flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-accent transition"
              >
                <div className="text-left">
                  <p className="font-medium">Switch to Yearly</p>
                  <p className="text-xs text-muted-foreground">{getProratedAmount(subscription.plan, "YEARLY")} (Save 17%)</p>
                </div>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Plan changes take effect immediately. Your billing cycle will be adjusted based on the prorated amount.
            </p>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="mt-4 rounded-lg bg-background p-4 border border-border">
          <p className="text-sm mb-4">
            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period on {endDate}.
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
