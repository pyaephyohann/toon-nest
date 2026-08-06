/**
 * POST /api/auth/login
 * User login endpoint
 */

import { NextRequest } from "next/server";
import { signIn } from "@/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { authService } from "@/services";
import { loginSchema } from "@/validations";
import { ZodError } from "zod";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = applyRateLimit(request, RATE_LIMITS.AUTH, "login");
    if (!rateLimitResult.allowed) {
      return errorResponse(
        ERROR_CODES.RATE_LIMIT_EXCEEDED,
        "Too many login attempts. Please try again later.",
        HTTP_STATUS.TOO_MANY_REQUESTS
      );
    }

    const body = await request.json();

    // Validate input using Zod
    const validatedData = loginSchema.parse(body);

    // Validate credentials using service
    await authService.validateCredentials(validatedData.email, validatedData.password);

    // Sign in with Auth.js
    // Note: Auth.js handles the actual session creation
    // This endpoint validates credentials and triggers Auth.js sign in
    // The actual sign-in will be handled by the client calling Auth.js signIn
    
    const response = successResponse(
      { email: validatedData.email },
      "Credentials validated successfully. Proceed with Auth.js signIn."
    );

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
