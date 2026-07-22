"use client";

import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  badge?: string;
  features: string[];
}

interface Props {
  plan: Plan;
}

export default function PricingCard({ plan }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-card p-8 transition-all duration-300 hover:-translate-y-2 ${
        plan.popular
          ? "border-primary shadow-[0_0_35px_rgba(139,92,246,.25)]"
          : "border-border hover:border-primary/50"
      }`}
    >
      {plan.popular && (
        <div className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </div>
      )}

      <h3 className="text-xl font-bold">{plan.name}</h3>

      <div className="mt-5 flex items-end gap-2">
        <span className="text-5xl font-bold">{plan.price}</span>

        <span className="pb-1 text-muted-foreground">{plan.period}</span>
      </div>

      {plan.badge && (
        <div className="mt-2 inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          {plan.badge}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
              <Check size={13} className="text-primary" />
            </div>

            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`mt-10 w-full rounded-xl py-3 font-semibold transition ${
          plan.popular
            ? "bg-primary text-white hover:bg-primary-hover"
            : "border border-border hover:border-primary hover:bg-primary/10"
        }`}
      >
        Choose Plan
      </button>
    </div>
  );
}
