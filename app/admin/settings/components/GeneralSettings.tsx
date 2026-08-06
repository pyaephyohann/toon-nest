"use client";

import { useGetGeneralSettingsQuery, useUpdateGeneralSettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";

export default function GeneralSettings() {
  const { data: settings, isLoading } = useGetGeneralSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateGeneralSettingsMutation();
  const [formData, setFormData] = useState(settings || {});

  const handleSave = async () => {
    try {
      await updateSettings(formData).unwrap();
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch("/api/admin/settings/general", { method: "DELETE" });
      if (response.ok) {
        const data = await response.json();
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Failed to reset settings:", error);
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
        <h3 className="text-xl font-bold">General Settings</h3>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
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
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            type="text"
            value={formData.siteName || ""}
            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Site Description</label>
          <textarea
            value={formData.siteDescription || ""}
            onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Site Logo URL</label>
          <input
            type="url"
            value={formData.siteLogo || ""}
            onChange={(e) => setFormData({ ...formData, siteLogo: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={formData.timezone || "UTC"}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={formData.language || "en"}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select
            value={formData.theme || "light"}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>
    </div>
  );
}
