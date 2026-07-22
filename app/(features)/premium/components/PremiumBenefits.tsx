"use client";

import {
  ShieldCheck,
  Zap,
  BookOpen,
  Download,
  ImageIcon,
  Headphones,
  BadgeCheck,
} from "lucide-react";

const benefits = [
  {
    title: "Ad-Free Reading",
    desc: "Enjoy uninterrupted reading experience.",
    icon: ShieldCheck,
    color: "text-violet-400 bg-violet-500/10",
  },
  {
    title: "Early Access",
    desc: "Read new chapters before everyone else.",
    icon: Zap,
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    title: "Unlimited Access",
    desc: "Access all premium series and chapters.",
    icon: BookOpen,
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    title: "Offline Reading",
    desc: "Download and read anywhere.",
    icon: Download,
    color: "text-cyan-400 bg-cyan-500/10",
  },
  {
    title: "High Quality",
    desc: "Read in the highest quality available.",
    icon: ImageIcon,
    color: "text-orange-400 bg-orange-500/10",
  },
  {
    title: "Priority Support",
    desc: "Get help faster with premium support.",
    icon: Headphones,
    color: "text-yellow-400 bg-yellow-500/10",
  },
  {
    title: "Exclusive Badge",
    desc: "Show off your premium status.",
    icon: BadgeCheck,
    color: "text-pink-400 bg-pink-500/10",
  },
];

export default function PremiumBenefits() {
  return (
    <aside className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">Premium Benefits</h3>

      <div className="space-y-5">
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={18} />
              </div>

              <div>
                <h4 className="font-semibold">{item.title}</h4>

                <p className="mt-1 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
