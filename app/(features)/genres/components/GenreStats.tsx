import StatCard from "@/components/ui/StatCard";
import { BookOpen, Library, Sparkles } from "lucide-react";

export default function GenreStats() {
  return (
    <aside className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">Genre Statistics</h3>

      <div className="space-y-5">
        <StatCard
          icon={Library}
          label="Total Genres"
          value="24"
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />

        <StatCard
          icon={BookOpen}
          label="Total Series"
          value="6,238"
          iconColor="text-emerald-500"
          iconBgColor="bg-emerald-500/10"
        />

        <StatCard
          icon={Sparkles}
          label="Added This Week"
          value="68"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-500/10"
        />
      </div>
    </aside>
  );
}
