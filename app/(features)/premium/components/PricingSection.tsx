"use client";

import { premiumPlans } from "./data";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {premiumPlans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </section>
  );
}
