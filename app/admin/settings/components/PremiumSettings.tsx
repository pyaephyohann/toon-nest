"use client";

import { useGetPremiumSettingsQuery, useUpdatePremiumSettingsMutation } from "@/store/api";
import { useState } from "react";
import { Save } from "lucide-react";

export default function PremiumSettings() {
  const { data: settings, isLoading } = useGetPremiumSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdatePremiumSettingsMutation();
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
        <h3 className="text-xl font-bold">Premium Settings</h3>
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
          <label className="block text-sm font-medium mb-2">Trial Days</label>
          <input
            type="number"
            value={formData.trialDays || 7}
            onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Monthly Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.monthlyPrice || 9.99}
            onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Yearly Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.yearlyPrice || 89.99}
            onChange={(e) => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Lifetime Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.lifetimePrice || 199.99}
            onChange={(e) => setFormData({ ...formData, lifetimePrice: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.discountEnabled || false}
              onChange={(e) => setFormData({ ...formData, discountEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Enable Discount</span>
          </label>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Discount Percentage</label>
            <input
              type="number"
              value={formData.discountPercentage || 20}
              onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
