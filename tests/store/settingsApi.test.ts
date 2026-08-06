/**
 * Settings API (RTK Query) Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupApiStore } from "./helpers/store";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import axios from "axios";
import { settingsApi } from "@/store/api/settingsApi";

describe("Settings API (RTK Query)", () => {
  let storeRef: any;

  beforeEach(() => {
    vi.clearAllMocks();
    storeRef = setupApiStore(settingsApi);
  });

  describe("useGetGeneralSettingsQuery", () => {
    it("should fetch general settings successfully", async () => {
      const mockSettings = {
        siteName: "ToonNest",
        theme: "light",
        timezone: "UTC",
      };

      vi.mocked(axios.get).mockResolvedValue({ data: { success: true, data: mockSettings } });

      const result = await storeRef.dispatch(settingsApi.endpoints.getGeneralSettings.initiate());

      expect(result.data).toEqual(mockSettings);
      expect(axios.get).toHaveBeenCalledWith("/api/admin/settings/general");
    });

    it("should handle errors", async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

      const result = await storeRef.dispatch(settingsApi.endpoints.getGeneralSettings.initiate());

      expect(result.error).toBeDefined();
    });
  });

  describe("useUpdateGeneralSettingsMutation", () => {
    it("should update general settings successfully", async () => {
      const updateData = {
        siteName: "New Name",
        theme: "dark",
      };

      const mockResponse = {
        siteName: "New Name",
        theme: "dark",
      };

      vi.mocked(axios.put).mockResolvedValue({ data: { success: true, data: mockResponse } });

      const result = await storeRef.dispatch(
        settingsApi.endpoints.updateGeneralSettings.initiate(updateData)
      );

      expect(result.data).toEqual(mockResponse);
      expect(axios.put).toHaveBeenCalledWith("/api/admin/settings/general", updateData);
    });
  });

  describe("useGetFeatureFlagsQuery", () => {
    it("should fetch feature flags successfully", async () => {
      const mockFlags = {
        registrationEnabled: true,
        darkModeEnabled: true,
        notificationsEnabled: true,
      };

      vi.mocked(axios.get).mockResolvedValue({ data: { success: true, data: mockFlags } });

      const result = await storeRef.dispatch(settingsApi.endpoints.getFeatureFlags.initiate());

      expect(result.data).toEqual(mockFlags);
      expect(axios.get).toHaveBeenCalledWith("/api/admin/settings/feature-flags");
    });
  });

  describe("useUpdateFeatureFlagsMutation", () => {
    it("should update feature flags successfully", async () => {
      const updateData = {
        registrationEnabled: false,
        darkModeEnabled: true,
      };

      const mockResponse = {
        registrationEnabled: false,
        darkModeEnabled: true,
      };

      vi.mocked(axios.put).mockResolvedValue({ data: { success: true, data: mockResponse } });

      const result = await storeRef.dispatch(
        settingsApi.endpoints.updateFeatureFlags.initiate(updateData)
      );

      expect(result.data).toEqual(mockResponse);
      expect(axios.put).toHaveBeenCalledWith("/api/admin/settings/feature-flags", updateData);
    });
  });
});
