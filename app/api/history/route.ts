/**
 * GET /api/history
 * POST /api/history
 * DELETE /api/history
 * Reading history endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse, paginatedResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { readingHistoryService } from "@/services";

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

    const { histories, total } = await readingHistoryService.getHistory(session.user.id, {
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginatedResponse(histories, total, page, limit, "History retrieved successfully");
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
    const { chapterId } = body;

    if (!chapterId) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "ChapterId is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const history = await readingHistoryService.saveReadingProgress(session.user.id, chapterId);

    return createdResponse(history, "Reading progress saved");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse(
        ERROR_CODES.AUTH_REQUIRED,
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await readingHistoryService.clearHistory(session.user.id);

    return successResponse(null, "History cleared successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
