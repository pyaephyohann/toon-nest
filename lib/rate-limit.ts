/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting for API protection
 * Can be upgraded to Redis for distributed systems
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param limit - Maximum number of requests
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
    };
  }

  // Increment count
  entry.count += 1;

  if (entry.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
  // Authentication endpoints - strict limits
  AUTH: {
    limit: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  },

  // Password reset - very strict
  PASSWORD_RESET: {
    limit: 3,
    windowMs: 60 * 1000, // 3 requests per minute
  },

  // General API - moderate limits
  API: {
    limit: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },

  // Admin API - stricter limits
  ADMIN_API: {
    limit: 50,
    windowMs: 60 * 1000, // 50 requests per minute
  },

  // File uploads - very strict
  UPLOAD: {
    limit: 10,
    windowMs: 60 * 1000, // 10 uploads per minute
  },
} as const;

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Check various headers for IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default (should not happen in production)
  return "unknown";
}

/**
 * Create a rate limit key from identifier and endpoint type
 */
export function createRateLimitKey(
  identifier: string,
  endpointType: string
): string {
  return `ratelimit:${endpointType}:${identifier}`;
}

/**
 * Apply rate limiting to a request
 * @param request - Next.js Request object
 * @param limitConfig - Rate limit configuration
 * @returns Object with allowed status and headers
 */
export function applyRateLimit(
  request: Request,
  limitConfig: { limit: number; windowMs: number },
  endpointType: string
): {
  allowed: boolean;
  headers: Record<string, string>;
} {
  const ip = getClientIp(request);
  const key = createRateLimitKey(ip, endpointType);
  const result = checkRateLimit(ip, limitConfig.limit, limitConfig.windowMs);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": limitConfig.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
  };

  if (!result.allowed) {
    headers["Retry-After"] = Math.ceil((result.resetTime - Date.now()) / 1000).toString();
  }

  return {
    allowed: result.allowed,
    headers,
  };
}
