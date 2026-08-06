/**
 * POST /api/auth/register
 * User registration endpoint
 */

import { NextRequest } from "next/server";
import { successResponse, errorResponse, handleApiError, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { authService } from "@/services";
import { registerSchema } from "@/validations";
import { ZodError } from "zod";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = applyRateLimit(request, RATE_LIMITS.AUTH, "register");
    if (!rateLimitResult.allowed) {
      return errorResponse(
        ERROR_CODES.RATE_LIMIT_EXCEEDED,
        "Too many registration attempts. Please try again later.",
        HTTP_STATUS.TOO_MANY_REQUESTS
      );
    }

    const body = await request.json();

    // Validate input using Zod
    const validatedData = registerSchema.parse(body);

    // Register user using service
    const user = await authService.register(validatedData);

    const response = createdResponse(user, "User registered successfully");

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        error.issues[0].message,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    return handleApiError(error);
  }
}
