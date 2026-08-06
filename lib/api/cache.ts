/**
 * API Cache Utilities
 * HTTP caching headers and response optimization
 */

/**
 * Cache duration constants (in seconds)
 */
export const CACHE_DURATION = {
  // Static content - cache for 1 year
  STATIC: 31536000,
  
  // Semi-static content - cache for 1 day
  SEMI_STATIC: 86400,
  
  // Dynamic content - cache for 1 hour
  DYNAMIC: 3600,
  
  // Real-time content - cache for 5 minutes
  REALTIME: 300,
  
  // No caching
  NO_CACHE: 0,
} as const;

/**
 * Get cache control header value
 */
export function getCacheControlHeader(maxAge: number, staleWhileRevalidate: number = 0): string {
  if (maxAge === 0) {
    return "no-store, no-cache, must-revalidate";
  }
  
  let header = `public, max-age=${maxAge}`;
  
  if (staleWhileRevalidate > 0) {
    header += `, stale-while-revalidate=${staleWhileRevalidate}`;
  }
  
  return header;
}

/**
 * Apply caching headers to a response
 */
export function applyCacheHeaders(
  response: Response,
  maxAge: number,
  staleWhileRevalidate: number = 0
): Response {
  const cacheControl = getCacheControlHeader(maxAge, staleWhileRevalidate);
  response.headers.set("Cache-Control", cacheControl);
  
  if (maxAge > 0) {
    response.headers.set("CDN-Cache-Control", cacheControl);
  }
  
  return response;
}

/**
 * Get cache duration for different data types
 */
export function getCacheDuration(dataType: string): number {
  const cacheMap: Record<string, number> = {
    // Static data
    "genres": CACHE_DURATION.SEMI_STATIC,
    "settings": CACHE_DURATION.SEMI_STATIC,
    "plans": CACHE_DURATION.SEMI_STATIC,
    
    // Semi-static data
    "series": CACHE_DURATION.DYNAMIC,
    "chapters": CACHE_DURATION.DYNAMIC,
    "statistics": CACHE_DURATION.DYNAMIC,
    
    // Dynamic data
    "comments": CACHE_DURATION.REALTIME,
    "ratings": CACHE_DURATION.REALTIME,
    "notifications": CACHE_DURATION.NO_CACHE,
    "history": CACHE_DURATION.REALTIME,
    "bookmarks": CACHE_DURATION.REALTIME,
    
    // User-specific data
    "user": CACHE_DURATION.REALTIME,
    "profile": CACHE_DURATION.REALTIME,
  };
  
  return cacheMap[dataType] || CACHE_DURATION.DYNAMIC;
}
