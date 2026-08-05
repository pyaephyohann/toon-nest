"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export default function DashboardCard({
  icon: Icon,
  label,
  value,
  trend,
  isLoading,
  className,
}: Props) {
  if (isLoading) {
    return (
      <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
        <div className="space-y-4">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
          <div className="h-8 animate-pulse rounded-lg bg-muted w-24" />
          <div className="h-12 animate-pulse rounded-lg bg-muted w-32" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive
                ? "text-green-600 bg-green-500/10"
                : "text-red-600 bg-red-500/10"
            )}
          >
            <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
