/**
 * Cache Monitoring Utilities
 * Track cache performance, hit rates, and health
 */

import { cache } from "./provider";
import { chapterPageCache } from "../reader";

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  keys: string[];
}

export interface CacheHealth {
  status: "healthy" | "warning" | "critical";
  message: string;
  metrics: CacheMetrics;
}

/**
 * Get cache metrics
 */
export async function getCacheMetrics(): Promise<CacheMetrics> {
  const stats = await cache.getStats();
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? (stats.hits / total) * 100 : 0;

  return {
    hits: stats.hits,
    misses: stats.misses,
    hitRate,
    size: stats.size,
    keys: stats.keys,
  };
}

/**
 * Get chapter cache metrics
 */
export function getChapterCacheMetrics() {
  return {
    size: chapterPageCache.size(),
    maxSize: 50,
    utilization: (chapterPageCache.size() / 50) * 100,
  };
}

/**
 * Get overall cache health
 */
export async function getCacheHealth(): Promise<CacheHealth> {
  const metrics = await getCacheMetrics();
  const chapterMetrics = getChapterCacheMetrics();

  let status: "healthy" | "warning" | "critical" = "healthy";
  let message = "Cache operating normally";

  // Check hit rate
  if (metrics.hitRate < 50) {
    status = "warning";
    message = "Low cache hit rate - consider increasing TTL";
  }

  // Check cache size
  if (metrics.size > 1000) {
    status = "warning";
    message = "Cache size is large - consider eviction policy";
  }

  if (metrics.size > 5000) {
    status = "critical";
    message = "Cache size is critical - immediate attention required";
  }

  // Check chapter cache utilization
  if (chapterMetrics.utilization > 90) {
    status = "warning";
    message = "Chapter cache near capacity - consider increasing size";
  }

  return {
    status,
    message,
    metrics,
  };
}

/**
 * Log cache operation
 */
export function logCacheOperation(operation: "get" | "set" | "delete" | "clear", key: string, success: boolean): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Cache] ${operation.toUpperCase()} ${key} - ${success ? "SUCCESS" : "FAILED"}`);
  }
}

/**
 * Reset cache statistics
 */
export async function resetCacheStats(): Promise<void> {
  await cache.clear();
  chapterPageCache.clear();
}

/**
 * Get cache report
 */
export async function getCacheReport(): Promise<{
  databaseCache: CacheMetrics;
  chapterCache: ReturnType<typeof getChapterCacheMetrics>;
  health: CacheHealth;
  timestamp: string;
}> {
  const [metrics, health] = await Promise.all([
    getCacheMetrics(),
    getCacheHealth(),
  ]);

  return {
    databaseCache: metrics,
    chapterCache: getChapterCacheMetrics(),
    health,
    timestamp: new Date().toISOString(),
  };
}
