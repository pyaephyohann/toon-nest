/**
 * POST /api/auth/register
 * User registration endpoint
 */

import { NextRequest } from "next/server";
import { successResponse, errorResponse, handleApiError, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { authService } from "@/services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Validate input
    if (!email || !username || !password) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Email, username, and password are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Register user using service
    const user = await authService.register({ email, username, password });

    return createdResponse(user, "User registered successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
