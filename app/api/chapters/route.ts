/**
 * POST /api/chapters
 * Create chapter endpoint (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { chapterService } from "@/services";

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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const body = await request.json();
    const { seriesId, chapterNumber, title, slug, unlockType } = body;

    if (!seriesId || !chapterNumber || !slug) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "SeriesId, chapterNumber, and slug are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const chapter = await chapterService.createChapter({
      seriesId,
      chapterNumber,
      title,
      slug,
      unlockType,
    });

    return createdResponse(chapter, "Chapter created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
