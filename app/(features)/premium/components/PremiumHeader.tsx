import PageHeader from "@/components/ui/PageHeader";
import { Crown } from "lucide-react";

export default function PremiumHeader() {
  return (
    <PageHeader
      title="Go Premium"
      description="Unlock exclusive features and enjoy the best reading experience."
      icon={Crown}
      iconColor="text-primary"
      iconBgColor="bg-primary/15"
    />
  );
}
