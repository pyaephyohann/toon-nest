/**
 * API Error Handler
 * Catches service errors and converts to standardized API responses
 * Prevents sensitive information leakage in production
 */

import { NextResponse } from "next/server";
import { errorResponse } from "./response";
import { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES } from "./constants";
import { env } from "@/lib/env";

/**
 * Handle API errors and return standardized error response
 */
export function handleApiError(error: unknown): NextResponse {
  // Log full error server-side for debugging
  console.error("API Error:", error);

  // In production, never expose internal error details
  const isProduction = env.NODE_ENV === "production";

  // Handle known error messages from services
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Authentication errors
    if (message.includes("not found")) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        isProduction ? ERROR_MESSAGES.NOT_FOUND : error.message,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Authorization errors
    if (message.includes("not authorized") || message.includes("permission") || message.includes("admin access required")) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        isProduction ? ERROR_MESSAGES.PERMISSION_DENIED : error.message,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Conflict errors
    if (message.includes("already exists") || message.includes("duplicate")) {
      return errorResponse(
        ERROR_CODES.ALREADY_EXISTS,
        isProduction ? ERROR_MESSAGES.ALREADY_EXISTS : error.message,
        HTTP_STATUS.CONFLICT
      );
    }

    // Validation errors
    if (message.includes("invalid") || message.includes("required")) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        isProduction ? ERROR_MESSAGES.VALIDATION_ERROR : error.message,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Database errors - never expose details
    if (message.includes("database") || message.includes("prisma") || message.includes("sql")) {
      return errorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    // Return the actual error message only in development
    return errorResponse(
      ERROR_CODES.VALIDATION_ERROR,
      isProduction ? ERROR_MESSAGES.VALIDATION_ERROR : error.message,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Unknown errors - always use generic message
  return errorResponse(
    ERROR_CODES.INTERNAL_ERROR,
    ERROR_MESSAGES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}
