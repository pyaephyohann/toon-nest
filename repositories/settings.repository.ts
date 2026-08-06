/**
 * Settings Repository
 * Handles system settings database operations
 */

import prisma from "@/lib/prisma";

export class SettingsRepository {
  /**
   * Get a single setting by key
   */
  async getSetting(key: string) {
    return prisma.systemSetting.findUnique({
      where: { key },
    });
  }

  /**
   * Get all settings by category
   */
  async getSettingsByCategory(category: "GENERAL" | "HOMEPAGE" | "PREMIUM" | "COMMUNITY" | "STORAGE" | "SEO" | "EMAIL" | "FEATURE_FLAGS" | "MAINTENANCE") {
    return prisma.systemSetting.findMany({
      where: { category },
    });
  }

  /**
   * Get all settings
   */
  async getAllSettings() {
    return prisma.systemSetting.findMany();
  }

  /**
   * Update a single setting
   */
  async updateSetting(key: string, value: string) {
    return prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, category: "GENERAL" },
    });
  }

  /**
   * Batch update settings
   */
  async updateSettings(updates: Array<{ key: string; value: string; category: string }>) {
    return prisma.$transaction(
      updates.map((update) =>
        prisma.systemSetting.upsert({
          where: { key: update.key },
          update: { value: update.value },
          create: { key: update.key, value: update.value, category: update.category as any },
        })
      )
    );
  }

  /**
   * Reset settings to defaults for a category
   */
  async resetCategory(category: string) {
    return prisma.systemSetting.deleteMany({
      where: { category: category as any },
    });
  }

  /**
   * Delete a setting
   */
  async deleteSetting(key: string) {
    return prisma.systemSetting.delete({
      where: { key },
    });
  }
}

export const settingsRepository = new SettingsRepository();
