import PageHeader from "@/components/ui/PageHeader";
import { Trophy } from "lucide-react";

export default function RankingsHeader() {
  return (
    <PageHeader
      title="Rankings"
      description="Discover the most popular series ranked by our community."
      icon={Trophy}
      iconColor="text-primary"
      iconBgColor="bg-primary/15"
    />
  );
}
