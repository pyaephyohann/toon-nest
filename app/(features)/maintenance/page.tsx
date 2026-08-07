/**
 * Maintenance Page
 * Scheduled maintenance page using the StatusPage component
 */

"use client";

import { StatusPage } from "@/components/ui/StatusPage";

export default function MaintenancePage() {
  return (
    <StatusPage
      type="info"
      title="Under Maintenance"
      description="We're currently performing scheduled maintenance. Please check back soon."
      primaryAction={{
        label: "Refresh Page",
        onClick: () => window.location.reload(),
      }}
      secondaryAction={{
        label: "Contact Us",
        href: "/",
      }}
      showBackground={true}
    />
  );
}
