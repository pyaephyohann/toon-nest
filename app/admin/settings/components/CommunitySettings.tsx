"use client";

import { useGetCommunitySettingsQuery, useUpdateCommunitySettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save } from "lucide-react";

export default function CommunitySettings() {
  const { data: settings, isLoading } = useGetCommunitySettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateCommunitySettingsMutation();
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
        <h3 className="text-xl font-bold">Community Settings</h3>
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
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.commentsEnabled || false}
              onChange={(e) => setFormData({ ...formData, commentsEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Enable Comments</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.ratingsEnabled || false}
              onChange={(e) => setFormData({ ...formData, ratingsEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Enable Ratings</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.commentModeration || false}
              onChange={(e) => setFormData({ ...formData, commentModeration: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Comment Moderation</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.userProfilesEnabled || false}
              onChange={(e) => setFormData({ ...formData, userProfilesEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">User Profiles</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.minRating || 1}
              onChange={(e) => setFormData({ ...formData, minRating: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Rating</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.maxRating || 5}
              onChange={(e) => setFormData({ ...formData, maxRating: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
