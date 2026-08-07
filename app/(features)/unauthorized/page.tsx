/**
 * Unauthorized Page (403)
 * Access denied page using the StatusPage component
 */

"use client";

import { StatusPage } from "@/components/ui/StatusPage";

export default function UnauthorizedPage() {
  return (
    <StatusPage
      type="warning"
      title="Access Denied"
      description="You don't have permission to access this resource."
      primaryAction={{
        label: "Go Back",
        onClick: () => window.history.back(),
      }}
      secondaryAction={{
        label: "Contact Support",
        href: "/",
      }}
      showBackground={true}
    />
  );
}
