/**
 * Cache Invalidation Utilities
 * Automatic and manual cache invalidation strategies
 */

import { dbCache } from "./database";
import { chapterPageCache } from "../reader";
import { CACHE_TAGS } from "./nextjs";

/**
 * Invalidation strategies for different data types
 */
export const INVALIDATION_STRATEGIES = {
  // Series mutations
  CREATE_SERIES: ["series-list", "stats:dashboard"],
  UPDATE_SERIES: (id: string) => [`series-${id}`, "series-list"],
  DELETE_SERIES: (id: string) => [`series-${id}`, "series-list", `stats:series:${id}`],
  
  // Chapter mutations
  CREATE_CHAPTER: (seriesId: string) => [`series-${seriesId}`, "chapter-list"],
  UPDATE_CHAPTER: (id: string, seriesId: string) => [`chapter-${id}`, `series-${seriesId}`],
  DELETE_CHAPTER: (id: string, seriesId: string) => [`chapter-${id}`, `series-${seriesId}`],
  
  // Comment mutations
  CREATE_COMMENT: (chapterId: string) => [`comments-chapter-${chapterId}`],
  UPDATE_COMMENT: (id: string) => ["comments"],
  DELETE_COMMENT: (id: string, chapterId: string) => [`comments-chapter-${chapterId}`],
  
  // Rating mutations
  CREATE_RATING: (seriesId: string) => [`ratings-series-${seriesId}`, `series-${seriesId}`],
  UPDATE_RATING: (seriesId: string) => [`ratings-series-${seriesId}`, `series-${seriesId}`],
  DELETE_RATING: (seriesId: string) => [`ratings-series-${seriesId}`, `series-${seriesId}`],
  
  // Bookmark mutations
  CREATE_BOOKMARK: (userId: string) => [`bookmarks-user-${userId}`],
  DELETE_BOOKMARK: (userId: string) => [`bookmarks-user-${userId}`],
  
  // History mutations
  CREATE_HISTORY: (userId: string) => [`history-user-${userId}`],
  DELETE_HISTORY: (userId: string) => [`history-user-${userId}`],
  
  // User mutations
  UPDATE_USER: (id: string) => [`user-${id}`],
  DELETE_USER: (id: string) => [`user-${id}`],
  
  // Settings mutations
  UPDATE_SETTINGS: ["settings-general", "settings-feature-flags"],
  
  // Genre mutations
  CREATE_GENRE: ["genres-all"],
  UPDATE_GENRE: (id: string) => [`genre-${id}`, "genres-all"],
  DELETE_GENRE: (id: string) => [`genre-${id}`, "genres-all"],
  
  // Plan mutations
  CREATE_PLAN: ["plans-all"],
  UPDATE_PLAN: (type: string) => [`plan:${type}`, "plans-all"],
  DELETE_PLAN: (type: string) => [`plan:${type}`, "plans-all"],
} as const;

/**
 * Invalidate cache by strategy
 */
export async function invalidateByStrategy(strategy: readonly string[] | ((...args: any[]) => string[]), ...args: any[]): Promise<void> {
  const keys = typeof strategy === "function" ? strategy(...args) : strategy;
  
  // Invalidate database cache
  for (const key of keys) {
    await dbCache.invalidate(key);
  }
  
  // Invalidate chapter cache if relevant
  for (const key of keys) {
    if (key.startsWith("chapter-")) {
      const chapterId = key.replace("chapter-", "");
      chapterPageCache.delete(chapterId);
    }
  }
}

/**
 * Invalidate series cache
 */
export async function invalidateSeriesCache(seriesId: string, action: "create" | "update" | "delete"): Promise<void> {
  switch (action) {
    case "create":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.CREATE_SERIES);
      break;
    case "update":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_SERIES, seriesId);
      break;
    case "delete":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.DELETE_SERIES, seriesId);
      break;
  }
}

/**
 * Invalidate chapter cache
 */
export async function invalidateChapterCache(
  chapterId: string,
  seriesId: string,
  action: "create" | "update" | "delete"
): Promise<void> {
  switch (action) {
    case "create":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.CREATE_CHAPTER, seriesId);
      break;
    case "update":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_CHAPTER, chapterId, seriesId);
      break;
    case "delete":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.DELETE_CHAPTER, chapterId, seriesId);
      break;
  }
  
  // Always invalidate chapter page cache
  chapterPageCache.delete(chapterId);
}

/**
 * Invalidate comment cache
 */
export async function invalidateCommentCache(chapterId: string, action: "create" | "update" | "delete"): Promise<void> {
  switch (action) {
    case "create":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.CREATE_COMMENT, chapterId);
      break;
    case "update":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_COMMENT, chapterId);
      break;
    case "delete":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.DELETE_COMMENT, chapterId, chapterId);
      break;
  }
}

/**
 * Invalidate rating cache
 */
export async function invalidateRatingCache(seriesId: string, action: "create" | "update" | "delete"): Promise<void> {
  switch (action) {
    case "create":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.CREATE_RATING, seriesId);
      break;
    case "update":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_RATING, seriesId);
      break;
    case "delete":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.DELETE_RATING, seriesId);
      break;
  }
}

/**
 * Invalidate user cache
 */
export async function invalidateUserCache(userId: string, action: "update" | "delete"): Promise<void> {
  switch (action) {
    case "update":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_USER, userId);
      break;
    case "delete":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.DELETE_USER, userId);
      break;
  }
}

/**
 * Invalidate settings cache
 */
export async function invalidateSettingsCache(): Promise<void> {
  await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_SETTINGS);
}

/**
 * Invalidate genre cache
 */
export async function invalidateGenreCache(genreId: string, action: "create" | "update" | "delete"): Promise<void> {
  switch (action) {
    case "create":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.CREATE_GENRE);
      break;
    case "update":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_GENRE, genreId);
      break;
    case "delete":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.DELETE_GENRE, genreId);
      break;
  }
}

/**
 * Invalidate plan cache
 */
export async function invalidatePlanCache(planType: string, action: "create" | "update" | "delete"): Promise<void> {
  switch (action) {
    case "create":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.CREATE_PLAN);
      break;
    case "update":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.UPDATE_PLAN, planType);
      break;
    case "delete":
      await invalidateByStrategy(INVALIDATION_STRATEGIES.DELETE_PLAN, planType);
      break;
  }
}

/**
 * Invalidate all caches
 */
export async function invalidateAllCaches(): Promise<void> {
  await dbCache.clear();
  chapterPageCache.clear();
}

/**
 * Batch invalidation
 */
export async function batchInvalidate(invalidations: Array<{ strategy: string[] | ((...args: any[]) => string[]), args?: any[] }>): Promise<void> {
  await Promise.all(
    invalidations.map(({ strategy, args = [] }) => invalidateByStrategy(strategy, ...args))
  );
}
