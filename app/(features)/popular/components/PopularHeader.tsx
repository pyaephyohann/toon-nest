import PageHeader from "@/components/ui/PageHeader";
import { Flame } from "lucide-react";

export default function PopularHeader() {
  return (
    <PageHeader
      title="Popular"
      description="Discover the most popular series loved by the community."
      icon={Flame}
      iconColor="text-primary"
      iconBgColor="bg-primary/15"
    />
  );
}
