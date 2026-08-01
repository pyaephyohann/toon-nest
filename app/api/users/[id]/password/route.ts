/**
 * PATCH /api/users/[id]/password
 * Change user password endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { userService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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

    // Users can only change their own password
    if (session.user.id !== id) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Not authorized to change this password",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Current password and new password are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await userService.changePassword(id, { currentPassword, newPassword });

    return successResponse(null, "Password changed successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
