"use client";

import { useGetStorageSettingsQuery, useUpdateStorageSettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save } from "lucide-react";

export default function StorageSettings() {
  const { data: settings, isLoading } = useGetStorageSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateStorageSettingsMutation();
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
        <h3 className="text-xl font-bold">Storage Settings</h3>
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
          <label className="block text-sm font-medium mb-2">Max Upload Size (bytes)</label>
          <input
            type="number"
            value={formData.maxUploadSize || 10485760}
            onChange={(e) => setFormData({ ...formData, maxUploadSize: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">Default: 10485760 (10MB)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Storage Provider</label>
          <select
            value={formData.storageProvider || "local"}
            onChange={(e) => setFormData({ ...formData, storageProvider: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="local">Local</option>
            <option value="s3">AWS S3</option>
            <option value="cloudflare">Cloudflare R2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CDN URL</label>
          <input
            type="url"
            value={formData.cdnUrl || ""}
            onChange={(e) => setFormData({ ...formData, cdnUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Allowed Image Types</label>
          <div className="space-y-2">
            {["jpg", "jpeg", "png", "webp", "gif"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.allowedImageTypes || []).includes(type)}
                  onChange={(e) => {
                    const types = formData.allowedImageTypes || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, allowedImageTypes: [...types, type] });
                    } else {
                      setFormData({ ...formData, allowedImageTypes: types.filter((t: string) => t !== type) });
                    }
                  }}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{type.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
