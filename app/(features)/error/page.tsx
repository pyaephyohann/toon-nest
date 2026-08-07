/**
 * Error Page
 * Generic error page using the StatusPage component
 */

"use client";

import { StatusPage } from "@/components/ui/StatusPage";

export default function ErrorPage() {
  return (
    <StatusPage
      type="error"
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
      primaryAction={{
        label: "Try Again",
        onClick: () => window.location.reload(),
      }}
      secondaryAction={{
        label: "Go Home",
        href: "/",
      }}
      showBackground={true}
    />
  );
}
