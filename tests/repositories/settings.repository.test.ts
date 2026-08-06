/**
 * Settings Repository Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { settingsRepository } from "@/repositories/settings.repository";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  default: {
    systemSetting: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import prisma from "@/lib/prisma";

describe("SettingsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSetting", () => {
    it("should get a setting by key", async () => {
      const mockSetting = {
        id: "setting-1",
        key: "general.siteName",
        value: "ToonNest",
        category: "GENERAL",
      };
      
      vi.mocked(prisma.systemSetting.findUnique).mockResolvedValue(mockSetting as any);
      
      const result = await settingsRepository.getSetting("general.siteName");
      
      expect(prisma.systemSetting.findUnique).toHaveBeenCalledWith({
        where: { key: "general.siteName" },
      });
      expect(result).toEqual(mockSetting);
    });

    it("should return null if setting not found", async () => {
      vi.mocked(prisma.systemSetting.findUnique).mockResolvedValue(null);
      
      const result = await settingsRepository.getSetting("non.existent");
      
      expect(result).toBeNull();
    });
  });

  describe("getSettingsByCategory", () => {
    it("should get all settings by category", async () => {
      const mockSettings = [
        {
          id: "setting-1",
          key: "general.siteName",
          value: "ToonNest",
          category: "GENERAL",
        },
        {
          id: "setting-2",
          key: "general.theme",
          value: "light",
          category: "GENERAL",
        },
      ];
      
      vi.mocked(prisma.systemSetting.findMany).mockResolvedValue(mockSettings as any);
      
      const result = await settingsRepository.getSettingsByCategory("GENERAL");
      
      expect(prisma.systemSetting.findMany).toHaveBeenCalledWith({
        where: { category: "GENERAL" },
      });
      expect(result).toEqual(mockSettings);
    });
  });

  describe("updateSetting", () => {
    it("should update an existing setting", async () => {
      const mockSetting = {
        id: "setting-1",
        key: "general.siteName",
        value: "New Name",
        category: "GENERAL",
      };
      
      vi.mocked(prisma.systemSetting.upsert).mockResolvedValue(mockSetting as any);
      
      const result = await settingsRepository.updateSetting("general.siteName", "New Name");
      
      expect(prisma.systemSetting.upsert).toHaveBeenCalledWith({
        where: { key: "general.siteName" },
        update: { value: "New Name" },
        create: { key: "general.siteName", value: "New Name", category: "GENERAL" },
      });
      expect(result).toEqual(mockSetting);
    });
  });

  describe("updateSettings", () => {
    it("should batch update settings", async () => {
      const updates = [
        { key: "general.siteName", value: "ToonNest", category: "GENERAL" },
        { key: "general.theme", value: "dark", category: "GENERAL" },
      ];
      
      vi.mocked(prisma.$transaction).mockResolvedValue([] as any);
      
      await settingsRepository.updateSettings(updates);
      
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("resetCategory", () => {
    it("should reset all settings in a category", async () => {
      vi.mocked(prisma.systemSetting.deleteMany).mockResolvedValue({ count: 2 } as any);
      
      await settingsRepository.resetCategory("GENERAL");
      
      expect(prisma.systemSetting.deleteMany).toHaveBeenCalledWith({
        where: { category: "GENERAL" },
      });
    });
  });

  describe("deleteSetting", () => {
    it("should delete a setting", async () => {
      const mockSetting = {
        id: "setting-1",
        key: "general.siteName",
        value: "ToonNest",
        category: "GENERAL",
      };
      
      vi.mocked(prisma.systemSetting.delete).mockResolvedValue(mockSetting as any);
      
      const result = await settingsRepository.deleteSetting("general.siteName");
      
      expect(prisma.systemSetting.delete).toHaveBeenCalledWith({
        where: { key: "general.siteName" },
      });
      expect(result).toEqual(mockSetting);
    });
  });
});
