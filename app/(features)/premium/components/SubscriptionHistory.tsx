"use client";

import { Subscription } from "@/store/api";
import { useGetSubscriptionHistoryQuery } from "@/store/api";
import { History, Calendar, Crown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import StatusBadge from "./StatusBadge";

export default function SubscriptionHistory() {
  const { data: history, isLoading, error } = useGetSubscriptionHistoryQuery();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-muted-foreground">Failed to load subscription history.</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <History className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">No Subscription History</h3>
            <p className="text-sm text-muted-foreground">Your subscription history will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  const displayHistory = isExpanded ? history : history.slice(0, 3);
  const hasMore = history.length > 3;

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "MONTHLY":
        return "Premium Monthly";
      case "YEARLY":
        return "Premium Yearly";
      case "FREE":
        return "Free";
      case "LIFETIME":
        return "Lifetime";
      default:
        return plan;
    }
  };

  const getPlanChangeIndicator = (currentPlan: string, nextPlan: string | undefined, index: number) => {
    if (index === history.length - 1) return null;
    const nextSub = history[index + 1];
    if (!nextSub) return null;
    
    if (currentPlan !== nextSub.plan) {
      return (
        <div className="flex items-center gap-1 text-xs text-primary">
          <Crown className="h-3 w-3" />
          <span>Plan changed</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Subscription History</h3>
        </div>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show all ({history.length})
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayHistory.map((subscription, index) => (
          <div
            key={subscription.id}
            className="relative flex items-start gap-4 pb-4"
          >
            {index !== displayHistory.length - 1 && (
              <div className="absolute left-[23px] top-10 bottom-0 w-0.5 bg-border" />
            )}
            
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background border-2 border-border">
              <Crown className={`h-5 w-5 ${subscription.status === "ACTIVE" ? "text-primary" : "text-muted-foreground"}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-semibold">{getPlanName(subscription.plan)}</h4>
                <StatusBadge status={subscription.status} size="sm" />
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(subscription.startsAt).toLocaleDateString()} - {new Date(subscription.expiresAt).toLocaleDateString()}
                </span>
                {subscription.cancelledAt && (
                  <span className="flex items-center gap-1 text-destructive">
                    <span>•</span>
                    Cancelled {new Date(subscription.cancelledAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {getPlanChangeIndicator(subscription.plan, history[index + 1]?.plan, index)}

              {subscription.autoRenew && subscription.status === "ACTIVE" && (
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <Crown className="h-3 w-3" />
                  <span>Auto-renew enabled</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
