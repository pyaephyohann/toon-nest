"use client";

import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function StatusBadge({ status, size = "md", showIcon = true }: Props) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "PAID":
        return {
          color: "text-green-600 bg-green-500/10 border-green-500/20",
          icon: CheckCircle,
          label: status === "ACTIVE" ? "Active" : "Paid",
        };
      case "CANCELLED":
      case "FAILED":
        return {
          color: "text-red-600 bg-red-500/10 border-red-500/20",
          icon: XCircle,
          label: status === "CANCELLED" ? "Cancelled" : "Failed",
        };
      case "EXPIRED":
      case "PENDING":
        return {
          color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
          icon: Clock,
          label: status === "EXPIRED" ? "Expired" : "Pending",
        };
      case "REFUNDED":
        return {
          color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
          icon: AlertCircle,
          label: "Refunded",
        };
      default:
        return {
          color: "text-muted-foreground bg-muted border-border",
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all",
        config.color,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
