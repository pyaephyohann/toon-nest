"use client";

import {
  ShieldCheck,
  Zap,
  BookOpen,
  Download,
  ImageIcon,
  Headphones,
  BadgeCheck,
  Lock,
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

interface Props {
  isPremium?: boolean;
}

export default function PremiumBenefits({ isPremium = false }: Props) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        {isPremium ? (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BadgeCheck className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-xl font-bold">
          {isPremium ? "Premium Benefits" : "Unlock Premium"}
        </h3>
      </div>

      <div className="space-y-4">
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`flex gap-4 ${!isPremium ? "opacity-60" : ""}`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={18} />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.title}</h4>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>

              {!isPremium && (
                <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
