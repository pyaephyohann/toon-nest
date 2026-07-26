import PageHeader from "@/components/ui/PageHeader";
import { History } from "lucide-react";

export default function HistoryHeader() {
  const stats = [
    { label: "Total History", value: "248 Chapters" },
    { label: "Reading Streak", value: "32 Days", valueColor: "text-emerald-400" },
    { label: "Last Read", value: "10 mins ago" },
  ];

  return (
    <PageHeader
      title="Reading History"
      description="Continue your reading journey from where you left off."
      icon={History}
      iconColor="text-primary"
      iconBgColor="bg-primary/15"
      stats={stats}
    />
  );
}
