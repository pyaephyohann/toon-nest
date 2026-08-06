"use client";

import { useGetEmailSettingsQuery, useUpdateEmailSettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save } from "lucide-react";

export default function EmailSettings() {
  const { data: settings, isLoading } = useGetEmailSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateEmailSettingsMutation();
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
        <h3 className="text-xl font-bold">Email Settings</h3>
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
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.emailEnabled || false}
              onChange={(e) => setFormData({ ...formData, emailEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Enable Email</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SMTP Host</label>
          <input
            type="text"
            value={formData.smtpHost || ""}
            onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SMTP Port</label>
          <input
            type="number"
            value={formData.smtpPort || 587}
            onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SMTP Username</label>
          <input
            type="text"
            value={formData.smtpUsername || ""}
            onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SMTP Password</label>
          <input
            type="password"
            value={formData.smtpPassword || ""}
            onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">From Email</label>
          <input
            type="email"
            value={formData.fromEmail || ""}
            onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">From Name</label>
          <input
            type="text"
            value={formData.fromName || ""}
            onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
