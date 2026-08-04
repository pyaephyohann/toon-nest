"use client";

import { Check } from "lucide-react";
import { PlanDetails } from "@/store/api";

interface Props {
  plan: PlanDetails;
  currentPlan?: string;
  onSelect?: (plan: string) => void;
}

export default function PlanCard({ plan, currentPlan, onSelect }: Props) {
  const isCurrentPlan = currentPlan === plan.plan;
  const isPopular = plan.isPopular;
  const price = plan.price === 0 ? "Free" : `$${plan.price}`;

  return (
    <div
      className={`relative rounded-2xl border-2 p-6 transition-all ${
        isPopular
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          {plan.price > 0 && <span className="text-muted-foreground">/{plan.plan === "MONTHLY" ? "month" : "year"}</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect?.(plan.plan)}
        disabled={isCurrentPlan}
        className={`w-full rounded-xl py-3 font-medium transition ${
          isCurrentPlan
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : isPopular
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        {isCurrentPlan ? "Current Plan" : plan.price === 0 ? "Get Started" : "Subscribe"}
      </button>
    </div>
  );
}
