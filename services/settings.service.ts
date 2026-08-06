/**
 * Settings Service
 * Handles system settings business logic with validation
 */

import { settingsRepository } from "@/repositories/settings.repository";
import { z } from "zod";

// Default settings for each category
const DEFAULT_SETTINGS = {
  GENERAL: {
    siteName: "ToonNest",
    siteDescription: "Your favorite manga reading platform",
    siteLogo: "",
    timezone: "UTC",
    language: "en",
    theme: "light",
  },
  HOMEPAGE: {
    heroTitle: "Welcome to ToonNest",
    heroDescription: "Read your favorite manga online",
    heroBackground: "",
    featuredSeriesIds: [],
    trendingEnabled: true,
    newReleasesEnabled: true,
  },
  PREMIUM: {
    trialDays: 7,
    monthlyPrice: 9.99,
    yearlyPrice: 89.99,
    lifetimePrice: 199.99,
    discountEnabled: true,
    discountPercentage: 20,
  },
  COMMUNITY: {
    commentsEnabled: true,
    ratingsEnabled: true,
    commentModeration: true,
    userProfilesEnabled: true,
    minRating: 1,
    maxRating: 5,
  },
  STORAGE: {
    maxUploadSize: 10485760, // 10MB
    allowedImageTypes: ["jpg", "jpeg", "png", "webp", "gif"],
    cdnUrl: "",
    storageProvider: "local",
  },
  SEO: {
    metaTitle: "ToonNest - Read Manga Online",
    metaDescription: "Read your favorite manga online for free",
    metaKeywords: "manga, anime, comics, webtoons",
    sitemapEnabled: true,
    robotsTxt: "User-agent: *\nAllow: /",
  },
  EMAIL: {
    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "ToonNest",
    emailEnabled: false,
  },
  FEATURE_FLAGS: {
    registrationEnabled: true,
    socialLoginEnabled: false,
    darkModeEnabled: true,
    notificationsEnabled: true,
    recommendationsEnabled: true,
  },
  MAINTENANCE: {
    maintenanceMode: false,
    maintenanceMessage: "We're currently performing maintenance. Please check back soon.",
    scheduledStart: null,
    scheduledEnd: null,
  },
};

// Validation schemas
const generalSettingsSchema = z.object({
  siteName: z.string().min(1).max(100),
  siteDescription: z.string().max(500),
  siteLogo: z.string().url().optional(),
  timezone: z.string(),
  language: z.string(),
  theme: z.enum(["light", "dark", "system"]),
});

const homepageSettingsSchema = z.object({
  heroTitle: z.string().min(1).max(200),
  heroDescription: z.string().max(500),
  heroBackground: z.string().url().optional(),
  featuredSeriesIds: z.array(z.string()),
  trendingEnabled: z.boolean(),
  newReleasesEnabled: z.boolean(),
});

const premiumSettingsSchema = z.object({
  trialDays: z.number().min(0).max(365),
  monthlyPrice: z.number().min(0),
  yearlyPrice: z.number().min(0),
  lifetimePrice: z.number().min(0),
  discountEnabled: z.boolean(),
  discountPercentage: z.number().min(0).max(100),
});

const communitySettingsSchema = z.object({
  commentsEnabled: z.boolean(),
  ratingsEnabled: z.boolean(),
  commentModeration: z.boolean(),
  userProfilesEnabled: z.boolean(),
  minRating: z.number().min(1).max(5),
  maxRating: z.number().min(1).max(10),
});

const storageSettingsSchema = z.object({
  maxUploadSize: z.number().min(1024),
  allowedImageTypes: z.array(z.string()),
  cdnUrl: z.string().url().optional(),
  storageProvider: z.enum(["local", "s3", "cloudflare"]),
});

const seoSettingsSchema = z.object({
  metaTitle: z.string().min(1).max(200),
  metaDescription: z.string().max(500),
  metaKeywords: z.string().max(500),
  sitemapEnabled: z.boolean(),
  robotsTxt: z.string(),
});

const emailSettingsSchema = z.object({
  smtpHost: z.string(),
  smtpPort: z.number().min(1).max(65535),
  smtpUsername: z.string(),
  smtpPassword: z.string(),
  fromEmail: z.string().email(),
  fromName: z.string().min(1).max(100),
  emailEnabled: z.boolean(),
});

const featureFlagsSchema = z.object({
  registrationEnabled: z.boolean(),
  socialLoginEnabled: z.boolean(),
  darkModeEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
  recommendationsEnabled: z.boolean(),
});

const maintenanceSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().max(1000),
  scheduledStart: z.string().nullable(),
  scheduledEnd: z.string().nullable(),
});

export class SettingsService {
  /**
   * Get settings by category with defaults
   */
  private async getSettingsWithDefaults(category: keyof typeof DEFAULT_SETTINGS) {
    const settings = await settingsRepository.getSettingsByCategory(category);
    const defaults = DEFAULT_SETTINGS[category];
    
    const result: Record<string, any> = { ...defaults };
    
    for (const setting of settings) {
      try {
        result[setting.key] = JSON.parse(setting.value);
      } catch {
        result[setting.key] = setting.value;
      }
    }
    
    return result;
  }

  /**
   * Get general settings
   */
  async getGeneralSettings() {
    return this.getSettingsWithDefaults("GENERAL");
  }

  /**
   * Update general settings
   */
  async updateGeneralSettings(data: any) {
    const validated = generalSettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `general.${key}`,
      value: JSON.stringify(value),
      category: "GENERAL",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getGeneralSettings();
  }

  /**
   * Get homepage settings
   */
  async getHomepageSettings() {
    return this.getSettingsWithDefaults("HOMEPAGE");
  }

  /**
   * Update homepage settings
   */
  async updateHomepageSettings(data: any) {
    const validated = homepageSettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `homepage.${key}`,
      value: JSON.stringify(value),
      category: "HOMEPAGE",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getHomepageSettings();
  }

  /**
   * Get premium settings
   */
  async getPremiumSettings() {
    return this.getSettingsWithDefaults("PREMIUM");
  }

  /**
   * Update premium settings
   */
  async updatePremiumSettings(data: any) {
    const validated = premiumSettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `premium.${key}`,
      value: JSON.stringify(value),
      category: "PREMIUM",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getPremiumSettings();
  }

  /**
   * Get community settings
   */
  async getCommunitySettings() {
    return this.getSettingsWithDefaults("COMMUNITY");
  }

  /**
   * Update community settings
   */
  async updateCommunitySettings(data: any) {
    const validated = communitySettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `community.${key}`,
      value: JSON.stringify(value),
      category: "COMMUNITY",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getCommunitySettings();
  }

  /**
   * Get storage settings
   */
  async getStorageSettings() {
    return this.getSettingsWithDefaults("STORAGE");
  }

  /**
   * Update storage settings
   */
  async updateStorageSettings(data: any) {
    const validated = storageSettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `storage.${key}`,
      value: JSON.stringify(value),
      category: "STORAGE",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getStorageSettings();
  }

  /**
   * Get SEO settings
   */
  async getSEOSettings() {
    return this.getSettingsWithDefaults("SEO");
  }

  /**
   * Update SEO settings
   */
  async updateSEOSettings(data: any) {
    const validated = seoSettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `seo.${key}`,
      value: JSON.stringify(value),
      category: "SEO",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getSEOSettings();
  }

  /**
   * Get email settings
   */
  async getEmailSettings() {
    return this.getSettingsWithDefaults("EMAIL");
  }

  /**
   * Update email settings
   */
  async updateEmailSettings(data: any) {
    const validated = emailSettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `email.${key}`,
      value: JSON.stringify(value),
      category: "EMAIL",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getEmailSettings();
  }

  /**
   * Get feature flags
   */
  async getFeatureFlags() {
    return this.getSettingsWithDefaults("FEATURE_FLAGS");
  }

  /**
   * Update feature flags
   */
  async updateFeatureFlags(data: any) {
    const validated = featureFlagsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `feature.${key}`,
      value: JSON.stringify(value),
      category: "FEATURE_FLAGS",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getFeatureFlags();
  }

  /**
   * Get maintenance settings
   */
  async getMaintenanceSettings() {
    return this.getSettingsWithDefaults("MAINTENANCE");
  }

  /**
   * Update maintenance settings
   */
  async updateMaintenanceSettings(data: any) {
    const validated = maintenanceSettingsSchema.parse(data);
    
    const updates = Object.entries(validated).map(([key, value]) => ({
      key: `maintenance.${key}`,
      value: JSON.stringify(value),
      category: "MAINTENANCE",
    }));
    
    await settingsRepository.updateSettings(updates);
    return this.getMaintenanceSettings();
  }

  /**
   * Reset settings to defaults for a category
   */
  async resetToDefaults(category: keyof typeof DEFAULT_SETTINGS) {
    await settingsRepository.resetCategory(category);
    return this.getSettingsWithDefaults(category);
  }
}

export const settingsService = new SettingsService();
