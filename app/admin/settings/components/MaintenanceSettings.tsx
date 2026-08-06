"use client";

import { useGetMaintenanceSettingsQuery, useUpdateMaintenanceSettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save, AlertTriangle } from "lucide-react";

export default function MaintenanceSettings() {
  const { data: settings, isLoading } = useGetMaintenanceSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateMaintenanceSettingsMutation();
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
        <h3 className="text-xl font-bold">Maintenance Mode</h3>
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isUpdating ? "Saving..." : "Save"}
        </button>
      </div>

      {formData.maintenanceMode && (
        <div className="rounded-xl border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Maintenance Mode Active</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              The site is currently in maintenance mode. Only admins can access the site.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium">Enable Maintenance Mode</span>
              <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
            </div>
            <input
              type="checkbox"
              checked={formData.maintenanceMode || false}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Maintenance Message</label>
          <textarea
            value={formData.maintenanceMessage || ""}
            onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Scheduled Start</label>
            <input
              type="datetime-local"
              value={formData.scheduledStart || ""}
              onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scheduled End</label>
            <input
              type="datetime-local"
              value={formData.scheduledEnd || ""}
              onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
