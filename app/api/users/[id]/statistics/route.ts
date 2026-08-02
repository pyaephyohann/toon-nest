/**
 * GET /api/users/[id]/statistics
 * User statistics endpoint
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
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse(
        ERROR_CODES.AUTH_REQUIRED,
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const { id } = await context.params;

    // Users can only view their own statistics
    if (session.user.id !== id) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Not authorized to view this user's statistics",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const statistics = await userService.getUserStatistics(id);

    return successResponse(statistics, "Statistics retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
