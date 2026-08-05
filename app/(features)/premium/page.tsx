"use client";

import { Suspense } from "react";
import { useGetPlansQuery, useGetSubscriptionsQuery, useCreateCheckoutSessionMutation } from "@/store/api";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PlansGrid from "./components/PlansGrid";
import SubscriptionSummary from "./components/SubscriptionSummary";
import SubscriptionHistory from "./components/SubscriptionHistory";
import BillingHistory from "./components/BillingHistory";
import BillingSummary from "./components/BillingSummary";
import PremiumBenefits from "./components/PremiumBenefits";
import HeroBanner from "./components/HeroBanner";

function PremiumPageContent() {
  const { data: plans, isLoading: plansLoading } = useGetPlansQuery();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useGetSubscriptionsQuery();
  const [createCheckoutSession, { isLoading: isCreatingCheckout }] = useCreateCheckoutSessionMutation();
  const searchParams = useSearchParams();
  const [checkoutStatus, setCheckoutStatus] = useState<"success" | "canceled" | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      setCheckoutStatus("success");
    } else if (canceled === "true") {
      setCheckoutStatus("canceled");
    }
  }, [searchParams]);

  const activeSubscription = subscriptions?.find((sub) => {
    const expiresAt = new Date(sub.expiresAt);
    return expiresAt > new Date() && sub.status === "ACTIVE";
  });

  const currentPlan = activeSubscription?.plan;
  const isPremium = !!activeSubscription;

  const handleSelectPlan = async (plan: string) => {
    if (plan === "FREE") {
      alert("You're already on the Free plan!");
      return;
    }

    try {
      const result = await createCheckoutSession({ plan }).unwrap();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert("Failed to create checkout session. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <HeroBanner />

      {checkoutStatus === "success" && (
        <div className="rounded-2xl border border-green-500 bg-green-500/10 p-4 text-center">
          <p className="text-green-600 font-medium">Payment successful! Your subscription is now active.</p>
        </div>
      )}

      {checkoutStatus === "canceled" && (
        <div className="rounded-2xl border border-yellow-500 bg-yellow-500/10 p-4 text-center">
          <p className="text-yellow-600 font-medium">Payment canceled. You can try again anytime.</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Subscription Info */}
        <div className="lg:col-span-2 space-y-6">
          <SubscriptionSummary
            subscription={activeSubscription || null}
            isLoading={subscriptionsLoading}
          />

          <div>
            <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
            <PlansGrid
              plans={plans || []}
              currentPlan={currentPlan}
              onSelectPlan={handleSelectPlan}
            />
          </div>

          <SubscriptionHistory />
          <BillingHistory />
        </div>

        {/* Right Column - Benefits & Billing */}
        <div className="space-y-6">
          <PremiumBenefits isPremium={isPremium} />
          <BillingSummary />
        </div>
      </div>
    </div>
  );
}

export default function PremiumPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <PremiumPageContent />
    </Suspense>
  );
}
