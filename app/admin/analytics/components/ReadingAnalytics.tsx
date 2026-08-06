"use client";

import { useGetReadingAnalyticsQuery } from "@/store/api";
import { AnalyticsParams } from "@/store/api/adminApi";
import { Eye, BookOpen, Bookmark, Star, TrendingUp } from "lucide-react";
import StatCard from "@/components/admin/charts/StatCard";
import LineChart from "@/components/admin/charts/LineChart";

interface Props {
  params: AnalyticsParams;
}

export default function ReadingAnalytics({ params }: Props) {
  const { data, isLoading, error } = useGetReadingAnalyticsQuery(params);

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
        <p className="text-center text-muted-foreground">Failed to load reading analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Reading Analytics</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={data.totalViews.toLocaleString()}
          icon={Eye}
        />
        <StatCard
          title="Total Readers"
          value={data.totalReaders.toLocaleString()}
          icon={BookOpen}
        />
        <StatCard
          title="Total Bookmarks"
          value={data.totalBookmarks.toLocaleString()}
          icon={Bookmark}
        />
        <StatCard
          title="Total Ratings"
          value={data.totalRatings.toLocaleString()}
          icon={Star}
        />
      </div>

      {/* Time Series Chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h4 className="font-semibold mb-4">Reading Trends</h4>
        <LineChart
          data={data.timeSeriesData}
          lines={[
            { dataKey: "views", color: "hsl(var(--primary))", name: "Views" },
            { dataKey: "readers", color: "hsl(var(--secondary))", name: "Readers" },
          ]}
          height={300}
        />
      </div>

      {/* Top Series */}
      {data.topSeries.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Series
          </h4>
          <div className="space-y-3">
            {data.topSeries.slice(0, 5).map((series) => (
              <div key={series.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                {series.coverImage && (
                  <img
                    src={series.coverImage}
                    alt={series.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{series.title}</p>
                  <p className="text-sm text-muted-foreground">{series.views.toLocaleString()} views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{series.readers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">readers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
