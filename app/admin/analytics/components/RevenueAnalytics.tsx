"use client";

import { useGetRevenueAnalyticsQuery } from "@/store/api";
import { AnalyticsParams } from "@/store/api/adminApi";
import { DollarSign, CreditCard, TrendingUp, Wallet } from "lucide-react";
import StatCard from "@/components/admin/charts/StatCard";
import LineChart from "@/components/admin/charts/LineChart";
import PieChart from "@/components/admin/charts/PieChart";

interface Props {
  params: AnalyticsParams;
}

export default function RevenueAnalytics({ params }: Props) {
  const { data, isLoading, error } = useGetRevenueAnalyticsQuery(params);

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
        <p className="text-center text-muted-foreground">Failed to load revenue analytics</p>
      </div>
    );
  }

  const revenueByPlanData = Object.entries(data.revenueByPlan).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Revenue Analytics</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${data.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Payments"
          value={data.totalPayments.toLocaleString()}
          icon={CreditCard}
        />
        <StatCard
          title="Avg Order Value"
          value={`$${data.averageOrderValue.toFixed(2)}`}
          icon={Wallet}
        />
        <StatCard
          title="Growth"
          value="+12%"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Time Series Chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h4 className="font-semibold mb-4">Revenue Trends</h4>
        <LineChart
          data={data.timeSeriesData}
          lines={[
            { dataKey: "revenue", color: "hsl(var(--primary))", name: "Revenue" },
            { dataKey: "payments", color: "hsl(var(--secondary))", name: "Payments" },
          ]}
          height={300}
        />
      </div>

      {/* Revenue by Plan */}
      {revenueByPlanData.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h4 className="font-semibold mb-4">Revenue by Plan</h4>
          <PieChart data={revenueByPlanData} height={300} />
        </div>
      )}
    </div>
  );
}
