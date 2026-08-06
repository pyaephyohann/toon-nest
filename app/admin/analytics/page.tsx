"use client";

import { useState } from "react";
import { useMeQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnalyticsParams } from "@/store/api/adminApi";
import { Download, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminSidebar from "../components/AdminSidebar";
import ReadingAnalytics from "./components/ReadingAnalytics";
import RevenueAnalytics from "./components/RevenueAnalytics";
import UserAnalytics from "./components/UserAnalytics";
import PlatformOverview from "./components/PlatformOverview";

export default function AdminAnalytics() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">("30d");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    if (!userLoading && user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, userLoading, router]);

  const getAnalyticsParams = (): AnalyticsParams => {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    switch (dateRange) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        startDate = customStartDate ? new Date(customStartDate) : undefined;
        endDate = customEndDate ? new Date(customEndDate) : undefined;
        break;
    }

    return {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      period: "DAILY",
    };
  };

  const handleExport = async (type: "reading" | "revenue" | "users") => {
    const params = getAnalyticsParams();
    const url = new URL(`/api/admin/analytics/export`, window.location.origin);
    url.searchParams.set("type", type);
    if (params.startDate) url.searchParams.set("startDate", params.startDate);
    if (params.endDate) url.searchParams.set("endDate", params.endDate);

    window.open(url.toString(), "_blank");
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const analyticsParams = getAnalyticsParams();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar username={user.username} avatar={user.avatar} />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track platform performance, revenue, and user engagement
              </p>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
                {["7d", "30d", "90d"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition",
                      dateRange === range
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setDateRange("custom")}
                className={cn(
                  "px-3 py-1.5 rounded-lg border border-border text-sm font-medium transition flex items-center gap-2",
                  dateRange === "custom" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <Calendar className="h-4 w-4" />
                Custom
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === "custom" && (
            <div className="mb-6 p-4 rounded-2xl border border-border bg-card">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Export Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleExport("reading")}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition flex items-center gap-2 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Export Reading Data
            </button>
            <button
              onClick={() => handleExport("revenue")}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition flex items-center gap-2 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Export Revenue Data
            </button>
            <button
              onClick={() => handleExport("users")}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition flex items-center gap-2 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Export User Data
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 gap-6">
            <PlatformOverview params={analyticsParams} />
            <ReadingAnalytics params={analyticsParams} />
            <RevenueAnalytics params={analyticsParams} />
            <UserAnalytics params={analyticsParams} />
          </div>
        </div>
      </main>
    </div>
  );
}
