/**
 * API Cache Middleware
 * Applies cache headers to API responses
 */

import { NextResponse } from "next/server";
import { getCacheControlHeader, getCacheDuration } from "../api/cache";

/**
 * Apply cache headers to API response
 */
export function applyApiCache(
  response: NextResponse,
  dataType: string,
  customTTL?: number
): NextResponse {
  const ttl = customTTL ?? getCacheDuration(dataType);
  const cacheControl = getCacheControlHeader(ttl, ttl / 2); // stale-while-revalidate at half TTL
  
  response.headers.set("Cache-Control", cacheControl);
  
  // Add CDN cache headers
  if (ttl > 0) {
    response.headers.set("CDN-Cache-Control", cacheControl);
    response.headers.set("Vary", "Accept-Encoding");
  }
  
  return response;
}

/**
 * Cache configuration for different API endpoints
 */
export const API_CACHE_CONFIG = {
  // Public endpoints - longer cache
  "/api/genres": { ttl: 86400, public: true },
  "/api/plans": { ttl: 86400, public: true },
  
  // Semi-public - medium cache
  "/api/manga": { ttl: 300, public: true },
  "/api/series": { ttl: 300, public: true },
  
  // User-specific - short cache
  "/api/users": { ttl: 60, public: false },
  "/api/bookmarks": { ttl: 60, public: false },
  "/api/history": { ttl: 60, public: false },
  
  // Real-time - no cache
  "/api/comments": { ttl: 0, public: false },
  "/api/notifications": { ttl: 0, public: false },
  "/api/ratings": { ttl: 60, public: true },
} as const;

/**
 * Get cache config for a path
 */
export function getCacheConfig(path: string) {
  // Find matching config
  for (const [key, config] of Object.entries(API_CACHE_CONFIG)) {
    if (path.startsWith(key)) {
      return config;
    }
  }
  
  // Default config
  return { ttl: 300, public: false };
}

/**
 * Apply cache headers based on path
 */
export function applyCacheByPath(response: NextResponse, path: string): NextResponse {
  const config = getCacheConfig(path);
  
  if (config.ttl === 0) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }
  
  const cacheControl = config.public
    ? `public, max-age=${config.ttl}, s-maxage=${config.ttl}`
    : `private, max-age=${config.ttl}`;
  
  response.headers.set("Cache-Control", cacheControl);
  
  return response;
}
