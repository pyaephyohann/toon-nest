/**
 * GET /api/users/[id]
 * PATCH /api/users/[id]
 * DELETE /api/users/[id]
 * User CRUD endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { userService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        "User not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(user, "User retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
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

    // Users can only update their own profile
    if (session.user.id !== id) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Not authorized to update this user",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const body = await request.json();
    const user = await userService.updateUserProfile(id, body);

    return successResponse(user, "User updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    // Users can only delete their own account
    if (session.user.id !== id) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Not authorized to delete this user",
        HTTP_STATUS.FORBIDDEN
      );
    }

    await userService.deleteUser(id);

    return successResponse(null, "User deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
