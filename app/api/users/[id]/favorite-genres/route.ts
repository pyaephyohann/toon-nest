/**
 * GET /api/users/[id]/favorite-genres
 * User favorite genres endpoint
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

    // Users can only view their own favorite genres
    if (session.user.id !== id) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Not authorized to view this user's favorite genres",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    const genres = await userService.getFavoriteGenres(id, limit);

    return successResponse(genres, "Favorite genres retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
