/**
 * API Error Handler
 * Catches service errors and converts to standardized API responses
 */

import { NextResponse } from "next/server";
import { errorResponse } from "./response";
import { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES } from "./constants";

/**
 * Handle API errors and return standardized error response
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Handle known error messages from services
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Authentication errors
    if (message.includes("not found")) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        error.message,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Authorization errors
    if (message.includes("not authorized") || message.includes("permission")) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        error.message,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Conflict errors
    if (message.includes("already exists") || message.includes("duplicate")) {
      return errorResponse(
        ERROR_CODES.ALREADY_EXISTS,
        error.message,
        HTTP_STATUS.CONFLICT
      );
    }

    // Validation errors
    if (message.includes("invalid") || message.includes("required")) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        error.message,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Return the actual error message if it's a known service error
    return errorResponse(
      ERROR_CODES.VALIDATION_ERROR,
      error.message,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Unknown errors
  return errorResponse(
    ERROR_CODES.INTERNAL_ERROR,
    ERROR_MESSAGES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}
