/**
 * POST /api/users/[id]/avatar
 * User avatar upload endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { userService } from "@/services";
import { validateUploadedFile, MAX_FILE_SIZES } from "@/lib/file-upload";
import { ZodError } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse(
        ERROR_CODES.AUTH_REQUIRED,
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const { id } = await context.params;

    // Users can only update their own avatar
    if (session.user.id !== id) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Not authorized to update this user's avatar",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const body = await request.json();
    const { avatar } = body;

    if (!avatar) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Avatar URL is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate avatar URL format
    try {
      new URL(avatar);
    } catch {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid avatar URL",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await userService.updateUserProfile(id, { avatar });

    return successResponse(user, "Avatar updated successfully");
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
