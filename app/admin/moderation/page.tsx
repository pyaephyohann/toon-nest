"use client";

import { useState } from "react";
import { useMeQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Report } from "@/store/api/moderationApi";
import AdminSidebar from "../components/AdminSidebar";
import ReportList from "./components/ReportList";
import ReportDetail from "./components/ReportDetail";
import CommentModeration from "./components/CommentModeration";
import ReviewModeration from "./components/ReviewModeration";
import UserModeration from "./components/UserModeration";
import ModerationHistory from "./components/ModerationHistory";

type Tab = "reports" | "comments" | "reviews" | "users" | "history";

export default function AdminModeration() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [activeTab, setActiveTab] = useState<Tab>("reports");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!userLoading && user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, userLoading, router]);

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedReport(null);
  };

  const handleDetailSuccess = () => {
    // The RTK Query cache will be invalidated automatically
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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar username={user.username} avatar={user.avatar} />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Content Moderation</h1>
            <p className="text-muted-foreground">
              Manage reports, moderate content, and track moderation history
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === "reports"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === "comments"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === "users"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              History
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "reports" && (
              <ReportList onViewDetail={handleViewDetail} />
            )}
            {activeTab === "comments" && <CommentModeration />}
            {activeTab === "reviews" && <ReviewModeration />}
            {activeTab === "users" && <UserModeration />}
            {activeTab === "history" && <ModerationHistory />}
          </div>

          {/* Report Detail Modal */}
          {isDetailOpen && selectedReport && (
            <ReportDetail
              reportId={selectedReport.id}
              onClose={handleDetailClose}
              onSuccess={handleDetailSuccess}
            />
          )}
        </div>
      </main>
    </div>
  );
}
