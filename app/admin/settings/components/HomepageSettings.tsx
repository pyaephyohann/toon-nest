"use client";

import { useGetHomepageSettingsQuery, useUpdateHomepageSettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";

export default function HomepageSettings() {
  const { data: settings, isLoading } = useGetHomepageSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateHomepageSettingsMutation();
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
        <h3 className="text-xl font-bold">Homepage Settings</h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hero Title</label>
          <input
            type="text"
            value={formData.heroTitle || ""}
            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hero Description</label>
          <textarea
            value={formData.heroDescription || ""}
            onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hero Background URL</label>
          <input
            type="url"
            value={formData.heroBackground || ""}
            onChange={(e) => setFormData({ ...formData, heroBackground: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.trendingEnabled || false}
              onChange={(e) => setFormData({ ...formData, trendingEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Enable Trending Section</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.newReleasesEnabled || false}
              onChange={(e) => setFormData({ ...formData, newReleasesEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Enable New Releases Section</span>
          </label>
        </div>
      </div>
    </div>
  );
}
