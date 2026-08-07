/**
 * Not Found Page (404)
 * Page not found using the StatusPage component
 */

import { StatusPage } from "@/components/ui/StatusPage";

export default function NotFoundPage() {
  return (
    <StatusPage
      type="info"
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      primaryAction={{
        label: "Go Home",
        href: "/",
      }}
      secondaryAction={{
        label: "Search",
        href: "/search",
      }}
      showBackground={true}
    />
  );
}
