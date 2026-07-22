"use client";

import { Check, Crown } from "lucide-react";
import { PremiumPlan } from "./types";

interface Props {
  plan: PremiumPlan;
}

export default function PricingCard({ plan }: Props) {
  return (
    <article
      className={`relative flex flex-col rounded-3xl border bg-card p-7 transition-all duration-300 hover:-translate-y-2 ${
        plan.popular
          ? "border-primary shadow-[0_0_40px_rgba(139,92,246,0.25)]"
          : "border-border hover:border-primary/40"
      }`}
    >
      {/* Popular Badge */}

      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-lg whitespace-nowrap">
            <Crown size={14} />
            Most Popular
          </div>
        </div>
      )}

      {/* Title */}

      <h3 className="text-xl font-semibold">{plan.title}</h3>

      {/* Price */}

      <div className="mt-5 flex flex-wrap items-end gap-x-2 gap-y-1">
        <span className="text-5xl font-extrabold leading-none">
          {plan.price}
        </span>

        <span className="pb-1 text-sm text-muted-foreground whitespace-nowrap">
          {plan.duration}
        </span>
      </div>

      {/* Discount */}

      {plan.badge && (
        <div className="mt-3 inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          {plan.badge}
        </div>
      )}

      {/* Features */}

      <div className="mt-8 space-y-4 flex-1">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/15 p-1">
              <Check size={12} className="text-primary" />
            </div>

            <span className="text-sm text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>

      {/* Button */}

      <button
        className={`mt-10 h-12 rounded-xl font-semibold transition ${
          plan.popular
            ? "bg-primary text-white hover:bg-primary-hover"
            : "border border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        Choose Plan
      </button>
    </article>
  );
}
