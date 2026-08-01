/**
 * POST /api/auth/login
 * User login endpoint
 */

import { NextRequest } from "next/server";
import { signIn } from "@/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { authService } from "@/services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Email and password are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate credentials using service
    await authService.validateCredentials(email, password);

    // Sign in with Auth.js
    // Note: Auth.js handles the actual session creation
    // This endpoint validates credentials and triggers Auth.js sign in
    // The actual sign-in will be handled by the client calling Auth.js signIn
    
    return successResponse(
      { email },
      "Credentials validated successfully. Proceed with Auth.js signIn."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
