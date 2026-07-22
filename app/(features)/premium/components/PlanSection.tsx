"use client";

import PricingCard from "./PricingCard";

const plans = [
  {
    name: "Monthly Plan",
    price: "$4.99",
    period: "/month",
    popular: false,
    features: [
      "Unlimited ad-free reading",
      "Access to premium chapters",
      "High quality images",
      "Offline reading",
      "Priority support",
    ],
  },
  {
    name: "Yearly Plan",
    price: "$47.99",
    period: "/year",
    popular: true,
    badge: "Save 20%",
    features: [
      "Everything in Monthly",
      "20% Discount",
      "Early access",
      "Premium badge",
      "Cancel anytime",
    ],
  },
  {
    name: "Lifetime Plan",
    price: "$149.99",
    period: "/one-time",
    popular: false,
    features: [
      "Everything in Yearly",
      "Lifetime access",
      "Premium badge",
      "Priority support",
      "One payment forever",
    ],
  },
];

export default function PlanSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>

        <div className="rounded-xl border border-border bg-card p-1">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
            Monthly
          </button>

          <button className="px-4 py-2 text-sm text-muted-foreground">
            Yearly
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}
