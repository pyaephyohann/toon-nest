"use client";

import { useGetUserAnalyticsQuery } from "@/store/api";
import { AnalyticsParams } from "@/store/api/adminApi";
import { Users, UserPlus, Activity, MessageSquare, Bookmark, Star } from "lucide-react";
import StatCard from "@/components/admin/charts/StatCard";
import LineChart from "@/components/admin/charts/LineChart";

interface Props {
  params: AnalyticsParams;
}

export default function UserAnalytics({ params }: Props) {
  const { data, isLoading, error } = useGetUserAnalyticsQuery(params);

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
        <p className="text-center text-muted-foreground">Failed to load user analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">User Analytics</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="New Users"
          value={data.newUsers.toLocaleString()}
          icon={UserPlus}
        />
        <StatCard
          title="Active Users"
          value={data.activeUsers.toLocaleString()}
          icon={Activity}
        />
        <StatCard
          title="Growth Rate"
          value={`${data.userGrowthRate.toFixed(1)}%`}
          icon={UserPlus}
          trend={{ value: data.userGrowthRate, isPositive: data.userGrowthRate >= 0 }}
        />
      </div>

      {/* User Growth Chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h4 className="font-semibold mb-4">User Growth</h4>
        <LineChart
          data={data.timeSeriesData}
          lines={[
            { dataKey: "registrations", color: "hsl(var(--primary))", name: "Registrations" },
          ]}
          height={300}
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Bookmarks</span>
          </div>
          <p className="text-2xl font-bold">{data.engagementMetrics.bookmarks.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Comments</span>
          </div>
          <p className="text-2xl font-bold">{data.engagementMetrics.comments.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Ratings</span>
          </div>
          <p className="text-2xl font-bold">{data.engagementMetrics.ratings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
