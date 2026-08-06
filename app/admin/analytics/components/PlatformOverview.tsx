"use client";

import { useGetPlatformAnalyticsQuery } from "@/store/api";
import { AnalyticsParams } from "@/store/api/adminApi";
import { BookOpen, FileText, MessageSquare, Star, PieChart as PieChartIcon } from "lucide-react";
import StatCard from "@/components/admin/charts/StatCard";
import PieChart from "@/components/admin/charts/PieChart";

interface Props {
  params: AnalyticsParams;
}

export default function PlatformOverview({ params }: Props) {
  const { data, isLoading, error } = useGetPlatformAnalyticsQuery(params);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-center text-muted-foreground">Failed to load platform analytics</p>
      </div>
    );
  }

  const genreData = data.genreDistribution.map((g) => ({
    name: g.name,
    value: g.readers,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Platform Overview</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Series"
          value={data.totalSeries.toLocaleString()}
          icon={BookOpen}
        />
        <StatCard
          title="Total Chapters"
          value={data.totalChapters.toLocaleString()}
          icon={FileText}
        />
        <StatCard
          title="Total Comments"
          value={data.totalComments.toLocaleString()}
          icon={MessageSquare}
        />
        <StatCard
          title="Total Ratings"
          value={data.totalRatings.toLocaleString()}
          icon={Star}
        />
      </div>

      {/* Genre Distribution */}
      {genreData.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Genre Distribution by Readers
          </h4>
          <PieChart data={genreData} height={300} />
        </div>
      )}

      {/* Genre Stats Table */}
      {data.genreDistribution.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h4 className="font-semibold mb-4">Genre Statistics</h4>
          <div className="space-y-2">
            {data.genreDistribution.map((genre) => (
              <div key={genre.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">{genre.name}</span>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{genre.readers.toLocaleString()} readers</span>
                  <span>{genre.seriesCount} series</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
