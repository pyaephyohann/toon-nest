"use client";

import { useGetPlansQuery, useGetSubscriptionsQuery } from "@/store/api";
import { useState } from "react";
import PlansGrid from "./components/PlansGrid";
import CurrentSubscription from "./components/CurrentSubscription";

export default function PremiumPage() {
  const { data: plans, isLoading: plansLoading } = useGetPlansQuery();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useGetSubscriptionsQuery();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const activeSubscription = subscriptions?.find((sub) => {
    const expiresAt = new Date(sub.expiresAt);
    return expiresAt > new Date();
  });

  const currentPlan = activeSubscription?.plan;

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    // Placeholder for subscription flow
    if (plan === "FREE") {
      alert("You're already on the Free plan!");
    } else {
      alert(`Subscribe to ${plan} plan - Payment integration coming soon!`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Premium Plans</h1>
        <p className="text-muted-foreground">Choose the perfect plan for your manga reading experience</p>
      </div>

      <CurrentSubscription
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
    </div>
  );
}
