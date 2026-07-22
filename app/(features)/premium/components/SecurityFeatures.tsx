"use client";

import { ShieldCheck, CircleDollarSign, Zap, Headphones } from "lucide-react";

const items = [
  {
    title: "Secure Payment",
    subtitle: "100% encrypted checkout",
    icon: ShieldCheck,
  },
  {
    title: "Cancel Anytime",
    subtitle: "No commitments",
    icon: CircleDollarSign,
  },
  {
    title: "Instant Access",
    subtitle: "Premium unlocked immediately",
    icon: Zap,
  },
  {
    title: "24/7 Support",
    subtitle: "Always here to help",
    icon: Headphones,
  },
];

export default function SecurityFeatures() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(139,92,246,.18)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon size={22} className="text-primary" />
            </div>

            <h3 className="font-semibold">{item.title}</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </section>
  );
}
