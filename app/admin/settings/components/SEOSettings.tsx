"use client";

import { useGetSEOSettingsQuery, useUpdateSEOSettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save } from "lucide-react";

export default function SEOSettings() {
  const { data: settings, isLoading } = useGetSEOSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSEOSettingsMutation();
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
        <h3 className="text-xl font-bold">SEO Settings</h3>
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
        <div>
          <label className="block text-sm font-medium mb-2">Meta Title</label>
          <input
            type="text"
            value={formData.metaTitle || ""}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meta Description</label>
          <textarea
            value={formData.metaDescription || ""}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meta Keywords</label>
          <input
            type="text"
            value={formData.metaKeywords || ""}
            onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.sitemapEnabled || false}
              onChange={(e) => setFormData({ ...formData, sitemapEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Enable Sitemap</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Robots.txt</label>
          <textarea
            value={formData.robotsTxt || ""}
            onChange={(e) => setFormData({ ...formData, robotsTxt: e.target.value })}
            rows={5}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}
