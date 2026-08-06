# Cache Strategy Documentation

This document outlines the complete caching strategy implemented for the ToonNest application.

## ✅ Implemented Cache Measures

### 1. Next.js Cache Strategy
- **Location**: `lib/cache/nextjs.ts`
- **Description**: Next.js data cache and reconfiguration helpers
- **Implemented Measures**:
  - Cache tags for selective invalidation (series, chapters, genres, users, settings, comments, ratings, bookmarks, history, notifications)
  - Cache TTL configuration (STATIC: 24h, SEMI_STATIC: 1h, DYNAMIC: 5m, REALTIME: 1m, NO_CACHE: 0)
  - `createCachedFunction` utility for wrapping functions with Next.js cache
  - `getCacheTTL` for data type-based TTL mapping
- **Status**: ✅ Complete

### 2. RTK Query Cache Optimization
- **Location**: `store/api/baseApi.ts`
- **Description**: Enhanced RTK Query cache configuration
- **Implemented Measures**:
  - `keepUnusedDataFor: 300` - Keep unused data for 5 minutes
  - `refetchOnMountOrArgChange: false` - Reduce unnecessary refetches
  - `refetchOnFocus: false` - Reduce unnecessary refetches
  - `refetchOnReconnect: true` - Refetch on network reconnection
  - Tag-based cache invalidation via existing tagTypes
- **Status**: ✅ Complete

### 3. Database Cache Layer
- **Location**: `lib/cache/database.ts`
- **Description**: Provider-agnostic cache abstraction for database queries
- **Implemented Measures**:
  - `ICacheProvider` interface for provider-agnostic caching
  - `MemoryCacheProvider` as default in-memory implementation
  - `DatabaseCache` class with convenience methods
  - Cache key generators for different data types
  - `getOrFetch` pattern for cache-aside strategy
  - Invalidation helpers (invalidateSeries, invalidateUser, invalidateSettings, etc.)
- **Status**: ✅ Complete

### 4. API Cache
- **Location**: `lib/cache/api.ts`
- **Description**: HTTP cache headers for API responses
- **Implemented Measures**:
  - `applyApiCache` for applying cache headers to responses
  - `API_CACHE_CONFIG` for endpoint-specific cache settings
  - `getCacheConfig` for path-based cache configuration
  - `applyCacheByPath` for automatic header application
  - Support for public/private cache directives
  - CDN cache headers
- **Status**: ✅ Complete

### 5. Reader Cache
- **Location**: `lib/reader.ts`
- **Description**: Chapter page caching and prefetching
- **Implemented Measures**:
  - `ChapterPageCache` class with LRU eviction (max 50 chapters)
  - `cacheChapterPages` for caching chapter pages
  - `getCachedChapterPages` for retrieving cached pages
  - `prefetchAdjacentChapters` for preloading next/previous chapters
  - Automatic image preloading for prefetched chapters
  - `clearChapterCache` for cache management
  - `getChapterCacheStats` for monitoring
- **Status**: ✅ Complete

### 6. Cache Invalidation
- **Location**: `lib/cache/invalidation.ts`
- **Description**: Automatic and manual cache invalidation strategies
- **Implemented Measures**:
  - `INVALIDATION_STRATEGIES` for all data types (series, chapters, comments, ratings, bookmarks, history, users, settings, genres, plans)
  - `invalidateByStrategy` for strategy-based invalidation
  - Specific invalidation functions (invalidateSeriesCache, invalidateChapterCache, etc.)
  - Cascade invalidation for related data
  - `batchInvalidate` for multiple invalidations
  - `invalidateAllCaches` for full cache clear
- **Status**: ✅ Complete

### 7. Cache Monitoring
- **Location**: `lib/cache/monitoring.ts`
- **Description**: Cache performance tracking and health monitoring
- **Implemented Measures**:
  - `getCacheMetrics` for database cache statistics (hits, misses, hit rate, size, keys)
  - `getChapterCacheMetrics` for chapter cache statistics
  - `getCacheHealth` for overall cache health assessment
  - Health status (healthy, warning, critical)
  - `logCacheOperation` for operation logging
  - `resetCacheStats` for statistics reset
  - `getCacheReport` for comprehensive cache report
- **Status**: ✅ Complete

### 8. Cache Configuration
- **Location**: `lib/cache/config.ts`
- **Description**: Centralized cache settings and environment-specific configurations
- **Implemented Measures**:
  - `CACHE_CONFIG` for global cache settings
  - `CACHE_TTL_CONFIG` for TTL by data type
  - `DATA_TYPE_TTL` mapping for data types to TTL categories
  - `getTTLConfig`, `getTTL`, `getStaleWhileRevalidate` utilities
  - `CACHE_KEY_PREFIXES` for consistent key naming
  - `buildCacheKey`, `parseCacheKey` utilities
  - `ENV_CACHE_CONFIG` for environment-specific settings
  - Redis configuration placeholder for future use
- **Status**: ✅ Complete

## 🚀 Cache Architecture

### Cache Layers
1. **Next.js Data Cache** - Server-side HTTP cache for API responses
2. **Database Cache** - Application-level cache for database queries
3. **RTK Query Cache** - Client-side cache for API state
4. **Reader Cache** - In-memory cache for chapter pages
5. **HTTP Cache** - Browser and CDN cache via headers

### Cache Flow
```
Client Request → RTK Query Cache → HTTP Cache → API Route → Database Cache → Database
```

### Cache Invalidation Flow
```
Mutation → Invalidation Strategy → Database Cache → RTK Query Tags → Next.js Cache → HTTP Cache
```

## 📊 Cache Configuration

### TTL by Data Type
- **Static** (24h): Genres, Plans
- **Semi-Static** (1h): Settings, Series Stats
- **Dynamic** (5m): Series, Chapters, Ratings
- **Real-time** (1m): Comments, History, Bookmarks
- **No Cache**: Notifications

### Cache Providers
- **Default**: In-memory Map with TTL support
- **Future**: Redis adapter (interface ready)
- **Fallback**: Direct database access

### Cache Sizes
- **Database Cache**: 1000 entries (configurable)
- **Chapter Cache**: 50 chapters with LRU eviction
- **RTK Query**: 5 minutes unused data retention

## 🔧 Usage Examples

### Database Cache
```typescript
import { dbCache } from "@/lib/cache";

// Cache a database query
const series = await dbCache.getSeriesById(seriesId, () => 
  prisma.series.findUnique({ where: { id: seriesId } })
);

// Invalidate on mutation
await dbCache.invalidateSeries(seriesId);
```

### Next.js Cache
```typescript
import { createCachedFunction, CACHE_TAGS, CACHE_TTL } from "@/lib/cache";

const getCachedSeries = createCachedFunction(
  async (id: string) => {
    return await prisma.series.findUnique({ where: { id } });
  },
  {
    tags: [CACHE_TAGS.SERIES_DETAIL(id)],
    revalidate: CACHE_TTL.DYNAMIC,
  }
);
```

### Reader Cache
```typescript
import { cacheChapterPages, prefetchAdjacentChapters } from "@/lib/reader";

// Cache chapter pages
cacheChapterPages(chapterId, pageUrls);

// Prefetch adjacent chapters
await prefetchAdjacentChapters(
  currentChapterId,
  nextChapterId,
  previousChapterId,
  fetchChapterPages
);
```

### Cache Invalidation
```typescript
import { invalidateSeriesCache } from "@/lib/cache";

// Invalidate after mutation
await invalidateSeriesCache(seriesId, "update");
```

### Cache Monitoring
```typescript
import { getCacheHealth, getCacheReport } from "@/lib/cache";

// Check cache health
const health = await getCacheHealth();

// Get full report
const report = await getCacheReport();
```

## 📝 Cache Guidelines for Future Development

### When Adding New Data Types
1. Add to `DATA_TYPE_TTL` in `lib/cache/config.ts`
2. Add cache key generator in `lib/cache/database.ts`
3. Add invalidation strategy in `lib/cache/invalidation.ts`
4. Apply cache headers in API routes using `lib/cache/api.ts`
5. Add RTK Query tags if applicable

### When Adding New API Endpoints
1. Determine appropriate cache duration
2. Apply cache headers using `applyApiCache` or `applyCacheByPath`
3. Add to `API_CACHE_CONFIG` if public endpoint
4. Consider using Next.js cache for GET requests
5. Add invalidation on mutations

### When Modifying Database Queries
1. Wrap with `dbCache.getOrFetch` for frequently accessed data
2. Use appropriate TTL based on data volatility
3. Add invalidation call in mutation handlers
4. Consider cache warming for critical data
5. Monitor cache hit rate

### When Optimizing Reader
1. Use `cacheChapterPages` for chapter data
2. Implement `prefetchAdjacentChapters` for smooth navigation
3. Monitor chapter cache utilization
4. Clear cache on chapter updates
5. Consider offline caching with service workers

## 🔍 Cache Monitoring

### Metrics to Track
- **Hit Rate**: Percentage of cache hits vs misses
- **Cache Size**: Number of entries in cache
- **Eviction Rate**: How often items are evicted
- **Response Time**: Cache vs database query time
- **Memory Usage**: Cache memory consumption

### Health Checks
- **Healthy**: Hit rate > 50%, size < 1000
- **Warning**: Hit rate < 50% or size > 1000
- **Critical**: Size > 5000

### Monitoring Tools
- [ ] Set up cache metrics dashboard
- [ ] Configure alerts for low hit rates
- [ ] Monitor cache size growth
- [ ] Track invalidation patterns
- [ ] Log cache operations in production

## 🎯 Future Enhancements

### High Priority
- [ ] Implement Redis adapter for distributed caching
- [ ] Add cache warming for critical data
- [ ] Implement cache versioning for schema changes
- [ ] Add cache compression for large values
- [ ] Implement cache persistence across restarts

### Medium Priority
- [ ] Add cache analytics dashboard
- [ ] Implement predictive caching
- [ ] Add cache partitioning by user
- [ ] Implement cache replication
- [ ] Add cache backup and restore

### Low Priority
- [ ] Consider using CDN for cache
- [ ] Implement edge caching
- [ ] Add cache encryption for sensitive data
- [ ] Implement cache sharding
- [ ] Add cache metrics export

## ✅ Summary

All planned caching measures have been implemented:
- ✅ Next.js cache strategy with tags and TTL
- ✅ RTK Query cache optimization
- ✅ Database cache abstraction layer
- ✅ API cache with HTTP headers
- ✅ Reader cache with LRU eviction
- ✅ Cache invalidation system
- ✅ Cache monitoring utilities
- ✅ Centralized cache configuration

The application now has a comprehensive, multi-layer caching strategy that is provider-agnostic and ready for production deployment.

## 📞 Cache Incident Response

### If Cache Issues are Detected
1. Check cache health status
2. Review cache metrics (hit rate, size)
3. Identify stale data patterns
4. Clear affected cache if necessary
5. Review invalidation logic
6. Monitor for recurrence

### Cache Degradation Checklist
- [ ] Check cache hit rate
- [ ] Review cache size
- [ ] Monitor memory usage
- [ ] Check invalidation patterns
- [ ] Review database query performance
- [ ] Check network latency
