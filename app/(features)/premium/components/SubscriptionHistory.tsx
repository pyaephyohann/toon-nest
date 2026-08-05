"use client";

import { Subscription } from "@/store/api";
import { useGetSubscriptionHistoryQuery } from "@/store/api";
import { History, Calendar, Crown, CheckCircle, XCircle, Clock } from "lucide-react";

export default function SubscriptionHistory() {
  const { data: history, isLoading, error } = useGetSubscriptionHistoryQuery();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-yellow-600" />;
      case "EXPIRED":
        return <Clock className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-500/10";
      case "CANCELLED":
        return "text-yellow-600 bg-yellow-500/10";
      case "EXPIRED":
        return "text-red-600 bg-red-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

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

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-lg">Subscription History</h3>
      </div>

      <div className="space-y-4">
        {history.map((subscription, index) => (
          <div
            key={subscription.id}
            className="relative flex items-start gap-4 pb-4"
          >
            {index !== history.length - 1 && (
              <div className="absolute left-[23px] top-10 bottom-0 w-0.5 bg-border" />
            )}
            
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background border border-border">
              {getStatusIcon(subscription.status)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{getPlanName(subscription.plan)}</h4>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(subscription.startsAt).toLocaleDateString()} - {new Date(subscription.expiresAt).toLocaleDateString()}
                </span>
                {subscription.cancelledAt && (
                  <span className="flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Cancelled {new Date(subscription.cancelledAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {subscription.autoRenew && subscription.status === "ACTIVE" && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Crown className="h-3 w-3" />
                  Auto-renew enabled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
