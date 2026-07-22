"use client";

import PremiumCard from "./PremiumCard";

const plans = [
  {
    title: "Monthly",
    price: "$4.99",
    period: "month",
    features: [
      "No advertisements",
      "Unlimited chapters",
      "Early chapter access",
      "HD quality images",
      "Offline downloads",
    ],
  },
  {
    title: "Yearly",
    price: "$39.99",
    period: "year",
    popular: true,
    features: [
      "Everything in Monthly",
      "2 Months FREE",
      "Exclusive premium badge",
      "Priority support",
      "Special event rewards",
      "Offline library",
    ],
  },
  {
    title: "Lifetime",
    price: "$99.99",
    period: "once",
    features: [
      "Unlimited forever",
      "Future premium features",
      "VIP badge",
      "Exclusive themes",
      "Early beta access",
    ],
  },
];

export default function PlanCards() {
  return (
    <section className="grid gap-8 lg:grid-cols-3">
      {plans.map((plan) => (
        <PremiumCard key={plan.title} {...plan} />
      ))}
    </section>
  );
}
