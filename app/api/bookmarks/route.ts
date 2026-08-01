/**
 * GET /api/bookmarks
 * POST /api/bookmarks
 * Bookmarks endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse, paginatedResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { bookmarkService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse(
        ERROR_CODES.AUTH_REQUIRED,
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    const { bookmarks, total } = await bookmarkService.getBookmarks(session.user.id, {
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginatedResponse(bookmarks, total, page, limit, "Bookmarks retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

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

    const bookmark = await bookmarkService.addBookmark(session.user.id, seriesId);

    return createdResponse(bookmark, "Bookmark added successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
