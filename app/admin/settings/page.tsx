"use client";

import { useState } from "react";
import { useMeQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import GeneralSettings from "./components/GeneralSettings";
import HomepageSettings from "./components/HomepageSettings";
import PremiumSettings from "./components/PremiumSettings";
import CommunitySettings from "./components/CommunitySettings";
import StorageSettings from "./components/StorageSettings";
import SEOSettings from "./components/SEOSettings";
import EmailSettings from "./components/EmailSettings";
import FeatureFlags from "./components/FeatureFlags";
import MaintenanceSettings from "./components/MaintenanceSettings";

type Tab = "general" | "homepage" | "premium" | "community" | "storage" | "seo" | "email" | "feature-flags" | "maintenance";

export default function AdminSettings() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [activeTab, setActiveTab] = useState<Tab>("general");

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">System Settings</h1>
            <p className="text-muted-foreground">
              Configure platform-wide settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "general"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("homepage")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "homepage"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Homepage
            </button>
            <button
              onClick={() => setActiveTab("premium")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "premium"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Premium
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "community"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Community
            </button>
            <button
              onClick={() => setActiveTab("storage")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "storage"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Storage
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "seo"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              SEO
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "email"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab("feature-flags")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "feature-flags"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Feature Flags
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === "maintenance"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Maintenance
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "homepage" && <HomepageSettings />}
            {activeTab === "premium" && <PremiumSettings />}
            {activeTab === "community" && <CommunitySettings />}
            {activeTab === "storage" && <StorageSettings />}
            {activeTab === "seo" && <SEOSettings />}
            {activeTab === "email" && <EmailSettings />}
            {activeTab === "feature-flags" && <FeatureFlags />}
            {activeTab === "maintenance" && <MaintenanceSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
