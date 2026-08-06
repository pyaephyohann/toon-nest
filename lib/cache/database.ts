/**
 * Database Cache Layer
 * Caches frequently accessed database queries using the cache provider
 */

import { cache, ICacheProvider } from "./provider";

/**
 * Cache key generators for different data types
 */
export const CACHE_KEYS = {
  // Settings
  SETTINGS_GENERAL: "settings:general",
  SETTINGS_FEATURE_FLAGS: "settings:feature-flags",
  SETTINGS_BY_CATEGORY: (category: string) => `settings:category:${category}`,
  
  // Genres
  GENRES_ALL: "genres:all",
  GENRE_BY_ID: (id: string) => `genre:${id}`,
  GENRE_BY_SLUG: (slug: string) => `genre:slug:${slug}`,
  
  // Plans
  PLANS_ALL: "plans:all",
  PLAN_BY_TYPE: (type: string) => `plan:${type}`,
  
  // Series
  SERIES_BY_ID: (id: string) => `series:${id}`,
  SERIES_BY_SLUG: (slug: string) => `series:slug:${slug}`,
  SERIES_LIST: (page: number, limit: number) => `series:list:${page}:${limit}`,
  
  // User
  USER_BY_ID: (id: string) => `user:${id}`,
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
  
  // Statistics
  DASHBOARD_STATS: "stats:dashboard",
  SERIES_STATS: (seriesId: string) => `stats:series:${seriesId}`,
} as const;

/**
 * Database cache wrapper
 */
export class DatabaseCache {
  constructor(private cacheProvider: ICacheProvider = cache) {}

  /**
   * Get cached data or fetch from database
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.cacheProvider.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    await this.cacheProvider.set(key, data, ttl);
    return data;
  }

  /**
   * Invalidate cache by key
   */
  async invalidate(key: string): Promise<void> {
    await this.cacheProvider.delete(key);
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    await this.cacheProvider.deletePattern(pattern);
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    await this.cacheProvider.clear();
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    return await this.cacheProvider.getStats();
  }

  /**
   * Cache settings
   */
  async getSettings(category: string, fetchFn: () => Promise<any>) {
    return this.getOrFetch(
      CACHE_KEYS.SETTINGS_BY_CATEGORY(category),
      fetchFn,
      3600 // 1 hour
    );
  }

  /**
   * Cache genres
   */
  async getGenres(fetchFn: () => Promise<any>) {
    return this.getOrFetch(
      CACHE_KEYS.GENRES_ALL,
      fetchFn,
      86400 // 24 hours
    );
  }

  /**
   * Cache plans
   */
  async getPlans(fetchFn: () => Promise<any>) {
    return this.getOrFetch(
      CACHE_KEYS.PLANS_ALL,
      fetchFn,
      86400 // 24 hours
    );
  }

  /**
   * Cache series by ID
   */
  async getSeriesById(id: string, fetchFn: () => Promise<any>) {
    return this.getOrFetch(
      CACHE_KEYS.SERIES_BY_ID(id),
      fetchFn,
      300 // 5 minutes
    );
  }

  /**
   * Cache series by slug
   */
  async getSeriesBySlug(slug: string, fetchFn: () => Promise<any>) {
    return this.getOrFetch(
      CACHE_KEYS.SERIES_BY_SLUG(slug),
      fetchFn,
      300 // 5 minutes
    );
  }

  /**
   * Cache user by ID
   */
  async getUserById(id: string, fetchFn: () => Promise<any>) {
    return this.getOrFetch(
      CACHE_KEYS.USER_BY_ID(id),
      fetchFn,
    300 // 5 minutes
    );
  }

  /**
   * Invalidate series cache
   */
  async invalidateSeries(seriesId: string): Promise<void> {
    await Promise.all([
      this.invalidate(CACHE_KEYS.SERIES_BY_ID(seriesId)),
      this.invalidatePattern("series:list:*"),
      this.invalidatePattern("stats:series:*"),
    ]);
  }

  /**
   * Invalidate user cache
   */
  async invalidateUser(userId: string): Promise<void> {
    await this.invalidate(CACHE_KEYS.USER_BY_ID(userId));
  }

  /**
   * Invalidate settings cache
   */
  async invalidateSettings(): Promise<void> {
    await this.invalidatePattern("settings:*");
  }

  /**
   * Invalidate genres cache
   */
  async invalidateGenres(): Promise<void> {
    await this.invalidatePattern("genres:*");
  }

  /**
   * Invalidate plans cache
   */
  async invalidatePlans(): Promise<void> {
    await this.invalidatePattern("plans:*");
  }
}

/**
 * Global database cache instance
 */
export const dbCache = new DatabaseCache();
