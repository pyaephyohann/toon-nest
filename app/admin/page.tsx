"use client";

import { useGetDashboardStatisticsQuery, useGetRecentActivityQuery } from "@/store/api";
import { useMeQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import DashboardCard from "./components/DashboardCard";
import RecentActivity from "./components/RecentActivity";
import {
  Users,
  BookOpen,
  FileText,
  Crown,
  MessageSquare,
  Star,
  DollarSign,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMeQuery();
  const { data: statistics, isLoading: statsLoading } = useGetDashboardStatisticsQuery();
  const { data: recentActivity, isLoading: activityLoading } = useGetRecentActivityQuery({ limit: 10 });

  useEffect(() => {
    if (!userLoading && user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, userLoading, router]);

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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar username={user.username} avatar={user.avatar} />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.username}! Here's what's happening.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard
              icon={Users}
              label="Total Users"
              value={statistics?.totalUsers || 0}
              isLoading={statsLoading}
            />
            <DashboardCard
              icon={BookOpen}
              label="Total Manga"
              value={statistics?.totalManga || 0}
              isLoading={statsLoading}
            />
            <DashboardCard
              icon={FileText}
              label="Total Chapters"
              value={statistics?.totalChapters || 0}
              isLoading={statsLoading}
            />
            <DashboardCard
              icon={Crown}
              label="Premium Users"
              value={statistics?.premiumUsers || 0}
              isLoading={statsLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard
              icon={Crown}
              label="Active Subscriptions"
              value={statistics?.activeSubscriptions || 0}
              isLoading={statsLoading}
            />
            <DashboardCard
              icon={MessageSquare}
              label="Total Comments"
              value={statistics?.totalComments || 0}
              isLoading={statsLoading}
            />
            <DashboardCard
              icon={Star}
              label="Total Reviews"
              value={statistics?.totalReviews || 0}
              isLoading={statsLoading}
            />
            <DashboardCard
              icon={DollarSign}
              label="Total Revenue"
              value={`$${statistics?.totalRevenue.toFixed(2) || "0.00"}`}
              isLoading={statsLoading}
            />
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            {recentActivity ? (
              <RecentActivity activity={recentActivity} isLoading={activityLoading} />
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">No Activity Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Recent activity will appear here
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
