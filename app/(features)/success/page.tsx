/**
 * Success Page
 * Generic success page using the StatusPage component
 */

import { StatusPage } from "@/components/ui/StatusPage";

export default function SuccessPage() {
  return (
    <StatusPage
      type="success"
      title="Success!"
      description="Your operation completed successfully."
      primaryAction={{
        label: "Continue",
        href: "/",
      }}
      secondaryAction={{
        label: "Go to Dashboard",
        href: "/",
      }}
      showBackground={true}
    />
  );
}
