/**
 * Cache Configuration
 * Centralized cache settings and environment-specific configurations
 */

import { env } from "../env";

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  // Enable/disable caching
  enabled: env.NODE_ENV !== "test",
  
  // Default TTL (in seconds)
  defaultTTL: 3600,
  
  // Maximum cache size (number of entries)
  maxSize: 1000,
  
  // Cache provider (memory, redis, etc.)
  provider: "memory",
  
  // Redis configuration (if using Redis)
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || "0"),
  },
  
  // Cache warming configuration
  warming: {
    enabled: true,
    onStartup: true,
    interval: 300, // 5 minutes
  },
  
  // Cache monitoring
  monitoring: {
    enabled: env.NODE_ENV === "development",
    logLevel: env.NODE_ENV === "development" ? "debug" : "info",
    metricsInterval: 60, // 1 minute
  },
} as const;

/**
 * Cache TTL configuration by data type
 */
export const CACHE_TTL_CONFIG = {
  // Static data - long cache
  STATIC: {
    ttl: 86400, // 24 hours
    staleWhileRevalidate: 43200, // 12 hours
  },
  
  // Semi-static data - medium cache
  SEMI_STATIC: {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 1800, // 30 minutes
  },
  
  // Dynamic data - short cache
  DYNAMIC: {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 150, // 2.5 minutes
  },
  
  // Real-time data - very short cache
  REALTIME: {
    ttl: 60, // 1 minute
    staleWhileRevalidate: 30, // 30 seconds
  },
  
  // No cache
  NO_CACHE: {
    ttl: 0,
    staleWhileRevalidate: 0,
  },
} as const;

/**
 * Data type to TTL mapping
 */
export const DATA_TYPE_TTL: Record<string, keyof typeof CACHE_TTL_CONFIG> = {
  // Static data
  genres: "STATIC",
  settings: "SEMI_STATIC",
  plans: "STATIC",
  
  // Semi-static data
  series: "DYNAMIC",
  seriesList: "DYNAMIC",
  chapters: "DYNAMIC",
  chapterList: "DYNAMIC",
  
  // Dynamic data
  comments: "REALTIME",
  ratings: "DYNAMIC",
  notifications: "NO_CACHE",
  history: "REALTIME",
  bookmarks: "REALTIME",
  
  // User-specific data
  user: "REALTIME",
  profile: "REALTIME",
  userBookmarks: "REALTIME",
  userHistory: "REALTIME",
  userNotifications: "NO_CACHE",
  
  // Admin data
  dashboardStats: "DYNAMIC",
  reports: "REALTIME",
  moderationHistory: "SEMI_STATIC",
} as const;

/**
 * Get TTL configuration for a data type
 */
export function getTTLConfig(dataType: string) {
  const ttlType = DATA_TYPE_TTL[dataType] || "DYNAMIC";
  return CACHE_TTL_CONFIG[ttlType];
}

/**
 * Get TTL for a data type
 */
export function getTTL(dataType: string): number {
  return getTTLConfig(dataType).ttl;
}

/**
 * Get stale-while-revalidate duration for a data type
 */
export function getStaleWhileRevalidate(dataType: string): number {
  return getTTLConfig(dataType).staleWhileRevalidate;
}

/**
 * Cache key prefixes
 */
export const CACHE_KEY_PREFIXES = {
  SETTINGS: "settings",
  GENRES: "genres",
  PLANS: "plans",
  SERIES: "series",
  CHAPTERS: "chapters",
  USERS: "users",
  COMMENTS: "comments",
  RATINGS: "ratings",
  BOOKMARKS: "bookmarks",
  HISTORY: "history",
  NOTIFICATIONS: "notifications",
  STATS: "stats",
} as const;

/**
 * Build cache key
 */
export function buildCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return [prefix, ...parts].join(":");
}

/**
 * Parse cache key
 */
export function parseCacheKey(key: string): { prefix: string; parts: string[] } {
  const parts = key.split(":");
  const prefix = parts[0];
  return {
    prefix,
    parts: parts.slice(1),
  };
}

/**
 * Environment-specific cache settings
 */
export const ENV_CACHE_CONFIG = {
  development: {
    enabled: true,
    defaultTTL: 300,
    maxSize: 500,
    monitoring: {
      enabled: true,
      logLevel: "debug",
    },
  },
  production: {
    enabled: true,
    defaultTTL: 3600,
    maxSize: 10000,
    monitoring: {
      enabled: true,
      logLevel: "info",
    },
  },
  test: {
    enabled: false,
    defaultTTL: 0,
    maxSize: 0,
    monitoring: {
      enabled: false,
      logLevel: "error",
    },
  },
} as const;

/**
 * Get environment-specific cache configuration
 */
export function getEnvCacheConfig() {
  const env = process.env.NODE_ENV || "development";
  return ENV_CACHE_CONFIG[env as keyof typeof ENV_CACHE_CONFIG] || ENV_CACHE_CONFIG.development;
}
