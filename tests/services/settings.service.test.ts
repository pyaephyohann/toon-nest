/**
 * Settings Service Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { settingsService } from "@/services/settings.service";

// Mock settings repository
vi.mock("@/repositories/settings.repository", () => ({
  settingsRepository: {
    getSettingsByCategory: vi.fn(),
    updateSettings: vi.fn(),
    resetCategory: vi.fn(),
  },
}));

import { settingsRepository } from "@/repositories/settings.repository";

describe("SettingsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGeneralSettings", () => {
    it("should return general settings with defaults", async () => {
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([
        {
          id: "setting-1",
          key: "general.siteName",
          value: '"Custom Name"',
          category: "GENERAL",
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ]);

      const result = await settingsService.getGeneralSettings();

      expect(settingsRepository.getSettingsByCategory).toHaveBeenCalledWith("GENERAL");
      expect(result).toHaveProperty("siteName", "Custom Name");
      expect(result).toHaveProperty("siteDescription");
      expect(result).toHaveProperty("timezone");
    });

    it("should return defaults when no settings exist", async () => {
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([]);

      const result = await settingsService.getGeneralSettings();

      expect(result.siteName).toBe("ToonNest");
      expect(result.theme).toBe("light");
    });
  });

  describe("updateGeneralSettings", () => {
    it("should update general settings", async () => {
      const updateData = {
        siteName: "New Name",
        siteDescription: "New Description",
        timezone: "America/New_York",
        language: "en",
        theme: "dark",
      };

      vi.mocked(settingsRepository.updateSettings).mockResolvedValue([]);
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([]);

      const result = await settingsService.updateGeneralSettings(updateData);

      expect(settingsRepository.updateSettings).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should validate site name", async () => {
      const invalidData = {
        siteName: "", // Invalid: empty string
        siteDescription: "Description",
        timezone: "UTC",
        language: "en",
        theme: "light",
      };

      await expect(settingsService.updateGeneralSettings(invalidData)).rejects.toThrow();
    });
  });

  describe("getHomepageSettings", () => {
    it("should return homepage settings with defaults", async () => {
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([]);

      const result = await settingsService.getHomepageSettings();

      expect(result.heroTitle).toBe("Welcome to ToonNest");
      expect(result.trendingEnabled).toBe(true);
    });
  });

  describe("updateHomepageSettings", () => {
    it("should update homepage settings", async () => {
      const updateData = {
        heroTitle: "New Hero Title",
        heroDescription: "New Description",
        trendingEnabled: false,
        newReleasesEnabled: true,
      };

      vi.mocked(settingsRepository.updateSettings).mockResolvedValue([]);
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([]);

      const result = await settingsService.updateHomepageSettings(updateData);

      expect(settingsRepository.updateSettings).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getFeatureFlags", () => {
    it("should return feature flags with defaults", async () => {
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([]);

      const result = await settingsService.getFeatureFlags();

      expect(result.registrationEnabled).toBe(true);
      expect(result.darkModeEnabled).toBe(true);
      expect(result.notificationsEnabled).toBe(true);
    });
  });

  describe("updateFeatureFlags", () => {
    it("should update feature flags", async () => {
      const updateData = {
        registrationEnabled: false,
        socialLoginEnabled: true,
        darkModeEnabled: true,
        notificationsEnabled: true,
        recommendationsEnabled: true,
      };

      vi.mocked(settingsRepository.updateSettings).mockResolvedValue([]);
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([]);

      const result = await settingsService.updateFeatureFlags(updateData);

      expect(settingsRepository.updateSettings).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("resetToDefaults", () => {
    it("should reset settings to defaults", async () => {
      vi.mocked(settingsRepository.resetCategory).mockResolvedValue({ count: 5 } as any);
      vi.mocked(settingsRepository.getSettingsByCategory).mockResolvedValue([]);

      const result = await settingsService.resetToDefaults("GENERAL");

      expect(settingsRepository.resetCategory).toHaveBeenCalledWith("GENERAL");
      expect(result.siteName).toBe("ToonNest");
    });
  });
});
