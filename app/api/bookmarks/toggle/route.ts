/**
 * POST /api/bookmarks/toggle
 * Toggle bookmark endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { bookmarkService } from "@/services";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse(
        ERROR_CODES.AUTH_REQUIRED,
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const body = await request.json();
    const { seriesId } = body;

    if (!seriesId) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "SeriesId is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await bookmarkService.toggleBookmark(session.user.id, seriesId);

    return successResponse(result, result.bookmarked ? "Bookmark added" : "Bookmark removed");
  } catch (error) {
    return handleApiError(error);
  }
}
