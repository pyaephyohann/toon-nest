/**
 * Next.js Cache Utilities
 * Next.js data cache and revalidation helpers
 */

import { unstable_cache } from 'next/cache';

/**
 * Cache tags for selective invalidation
 */
export const CACHE_TAGS = {
  // Series
  SERIES: 'series',
  SERIES_LIST: 'series-list',
  SERIES_DETAIL: (id: string) => `series-${id}`,
  
  // Chapters
  CHAPTERS: 'chapters',
  CHAPTER_LIST: 'chapter-list',
  CHAPTER_DETAIL: (id: string) => `chapter-${id}`,
  
  // Genres
  GENRES: 'genres',
  GENRE_DETAIL: (id: string) => `genre-${id}`,
  
  // Users
  USERS: 'users',
  USER_DETAIL: (id: string) => `user-${id}`,
  
  // Settings
  SETTINGS: 'settings',
  SETTINGS_GENERAL: 'settings-general',
  SETTINGS_FEATURE_FLAGS: 'settings-feature-flags',
  
  // Comments
  COMMENTS: 'comments',
  COMMENTS_BY_CHAPTER: (chapterId: string) => `comments-chapter-${chapterId}`,
  
  // Ratings
  RATINGS: 'ratings',
  RATINGS_BY_SERIES: (seriesId: string) => `ratings-series-${seriesId}`,
  
  // Bookmarks
  BOOKMARKS: 'bookmarks',
  USER_BOOKMARKS: (userId: string) => `bookmarks-user-${userId}`,
  
  // History
  HISTORY: 'history',
  USER_HISTORY: (userId: string) => `history-user-${userId}`,
  
  // Notifications
  NOTIFICATIONS: 'notifications',
  USER_NOTIFICATIONS: (userId: string) => `notifications-user-${userId}`,
} as const;

/**
 * Cache TTL configuration (in seconds)
 */
export const CACHE_TTL = {
  // Static data - long cache
  STATIC: 86400, // 24 hours
  
  // Semi-static data - medium cache
  SEMI_STATIC: 3600, // 1 hour
  
  // Dynamic data - short cache
  DYNAMIC: 300, // 5 minutes
  
  // Real-time data - very short cache
  REALTIME: 60, // 1 minute
  
  // No cache
  NO_CACHE: 0,
} as const;

/**
 * Create a cached function with Next.js unstable_cache
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    tags?: string[];
    revalidate?: number;
  } = {}
): T {
  const keyParts = options.tags || [];
  return unstable_cache(fn, keyParts, {
    revalidate: options.revalidate || CACHE_TTL.DYNAMIC,
    tags: options.tags,
  }) as T;
}

/**
 * Get cache TTL for different data types
 */
export function getCacheTTL(dataType: string): number {
  const ttlMap: Record<string, number> = {
    // Static data
    'genres': CACHE_TTL.STATIC,
    'settings': CACHE_TTL.SEMI_STATIC,
    'plans': CACHE_TTL.SEMI_STATIC,
    
    // Semi-static data
    'series': CACHE_TTL.DYNAMIC,
    'series-list': CACHE_TTL.DYNAMIC,
    'chapters': CACHE_TTL.DYNAMIC,
    
    // Dynamic data
    'comments': CACHE_TTL.REALTIME,
    'ratings': CACHE_TTL.REALTIME,
    'notifications': CACHE_TTL.NO_CACHE,
    'history': CACHE_TTL.REALTIME,
    'bookmarks': CACHE_TTL.REALTIME,
    
    // User-specific data
    'user': CACHE_TTL.REALTIME,
    'profile': CACHE_TTL.REALTIME,
  };
  
  return ttlMap[dataType] || CACHE_TTL.DYNAMIC;
}
