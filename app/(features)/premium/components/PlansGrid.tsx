"use client";

import { PlanDetails } from "@/store/api";
import PlanCard from "./PlanCard";

interface Props {
  plans: PlanDetails[];
  currentPlan?: string;
  onSelectPlan?: (plan: string) => void;
}

export default function PlansGrid({ plans, currentPlan, onSelectPlan }: Props) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No plans available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          currentPlan={currentPlan}
          onSelect={onSelectPlan}
        />
      ))}
    </div>
  );
}
