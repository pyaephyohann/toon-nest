"use client";

import { Crown, Lock } from "lucide-react";

interface Props {
  type?: "premium" | "locked";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PremiumBadge({ type = "premium", size = "md", className = "" }: Props) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (type === "locked") {
    return (
      <div
        className={`inline-flex items-center rounded-full bg-muted text-muted-foreground ${sizeClasses[size]} ${className}`}
      >
        <Lock className={iconSizes[size]} />
        <span>Locked</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full bg-primary text-primary-foreground ${sizeClasses[size]} ${className}`}
    >
      <Crown className={iconSizes[size]} />
      <span>Premium</span>
    </div>
  );
}
