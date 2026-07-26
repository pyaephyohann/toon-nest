import PageHeader from "@/components/ui/PageHeader";
import { CheckCheck } from "lucide-react";

export default function CompletedHeader() {
  return (
    <PageHeader
      title="Completed"
      description="Finished series ready to binge from beginning to end."
      icon={CheckCheck}
      iconColor="text-emerald-400"
      iconBgColor="bg-emerald-500/15"
    />
  );
}
