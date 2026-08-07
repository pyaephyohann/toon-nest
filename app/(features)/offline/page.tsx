/**
 * Offline Page
 * Offline status page using the StatusPage component
 */

"use client";

import { StatusPage } from "@/components/ui/StatusPage";

export default function OfflinePage() {
  return (
    <StatusPage
      type="warning"
      title="You're Offline"
      description="Please check your internet connection and try again."
      primaryAction={{
        label: "Retry",
        onClick: () => window.location.reload(),
      }}
      secondaryAction={{
        label: "Go Offline",
        href: "/",
      }}
      showBackground={true}
    />
  );
}
