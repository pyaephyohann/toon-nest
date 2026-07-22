import { PremiumPlan } from "./types";

export const premiumPlans: PremiumPlan[] = [
  {
    id: "monthly",
    title: "Monthly Plan",
    price: "$4.99",
    duration: "/month",
    features: [
      "Unlimited ad-free reading",
      "Premium chapters",
      "Offline reading",
      "Priority support",
    ],
  },

  {
    id: "yearly",
    title: "Yearly Plan",
    price: "$47.99",
    duration: "/year",
    popular: true,
    badge: "Save 20%",
    features: [
      "Everything in Monthly",
      "20% Discount",
      "Early Access",
      "Exclusive Badge",
      "Cancel Anytime",
    ],
  },

  {
    id: "lifetime",
    title: "Lifetime Plan",
    price: "$149.99",
    duration: "/one-time",
    features: [
      "Everything in Yearly",
      "One-time payment",
      "Lifetime Premium",
      "Lifetime Badge",
      "Priority Support",
    ],
  },
];
