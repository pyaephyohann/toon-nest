"use client";

import { useGetFeatureFlagsQuery, useUpdateFeatureFlagsMutation } from "@/store/api";
import { useState } from "react";
import { Save } from "lucide-react";

export default function FeatureFlags() {
  const { data: settings, isLoading } = useGetFeatureFlagsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateFeatureFlagsMutation();
  const [formData, setFormData] = useState(settings || {});

  const handleSave = async () => {
    try {
      await updateSettings(formData).unwrap();
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Feature Flags</h3>
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isUpdating ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium">Registration</span>
              <p className="text-sm text-muted-foreground">Enable user registration</p>
            </div>
            <input
              type="checkbox"
              checked={formData.registrationEnabled || false}
              onChange={(e) => setFormData({ ...formData, registrationEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium">Social Login</span>
              <p className="text-sm text-muted-foreground">Enable social media login options</p>
            </div>
            <input
              type="checkbox"
              checked={formData.socialLoginEnabled || false}
              onChange={(e) => setFormData({ ...formData, socialLoginEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium">Dark Mode</span>
              <p className="text-sm text-muted-foreground">Enable dark mode theme</p>
            </div>
            <input
              type="checkbox"
              checked={formData.darkModeEnabled || false}
              onChange={(e) => setFormData({ ...formData, darkModeEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium">Notifications</span>
              <p className="text-sm text-muted-foreground">Enable user notifications</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notificationsEnabled || false}
              onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium">Recommendations</span>
              <p className="text-sm text-muted-foreground">Enable content recommendations</p>
            </div>
            <input
              type="checkbox"
              checked={formData.recommendationsEnabled || false}
              onChange={(e) => setFormData({ ...formData, recommendationsEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
