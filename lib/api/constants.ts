/**
 * API Constants
 * Shared constants for API routes
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_REQUIRED: "AUTH_REQUIRED",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Invalid input data",
  AUTH_REQUIRED: "Authentication required",
  PERMISSION_DENIED: "Insufficient permissions",
  NOT_FOUND: "Resource not found",
  ALREADY_EXISTS: "Resource already exists",
  INTERNAL_ERROR: "Internal server error",
  INVALID_CREDENTIALS: "Invalid email or password",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  LOGGED_IN: "Logged in successfully",
  LOGGED_OUT: "Logged out successfully",
  REGISTERED: "Registered successfully",
} as const;
