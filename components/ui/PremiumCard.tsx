import { Crown, Sparkles } from "lucide-react";

interface PremiumCardProps {
  title?: string;
  description?: string;
  features?: string[];
  buttonText?: string;
  variant?: "gradient" | "simple";
}

export default function PremiumCard({
  title = "ToonNest Premium",
  description = "Sync your bookmarks across every device, unlock exclusive chapters and enjoy an ad-free reading experience.",
  features = ["Unlimited Bookmarks", "Cloud Sync", "No Ads", "Early Access"],
  buttonText = "Upgrade Now",
  variant = "gradient",
}: PremiumCardProps) {
  if (variant === "simple") {
    return (
      <div className="rounded-2xl bg-primary/30 p-4">
        <h3 className="font-semibold">{title}</h3>
        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
          {features.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>
        <button className="mt-4 w-full rounded-xl bg-primary py-2 text-white">
          {buttonText}
        </button>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-indigo-700 p-6 text-white">
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/15 p-3">
            <Crown className="size-6" />
          </div>

          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        <p className="mt-5 text-sm leading-7 text-white/80">{description}</p>

        <ul className="mt-6 space-y-3 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Sparkles size={16} />
              {feature}
            </li>
          ))}
        </ul>

        <button className="mt-8 w-full rounded-xl bg-white py-3 font-semibold text-primary transition hover:scale-[1.02]">
          {buttonText}
        </button>
      </div>
    </section>
  );
}
