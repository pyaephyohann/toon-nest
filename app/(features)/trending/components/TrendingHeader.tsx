import PageHeader from "@/components/ui/PageHeader";
import { Flame } from "lucide-react";

export default function TrendingHeader() {
  return (
    <PageHeader
      title="Trending"
      description="Hot and rising series everyone is talking about."
      icon={Flame}
      iconColor="text-primary"
      iconBgColor="bg-primary/15"
    />
  );
}
