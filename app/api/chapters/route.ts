/**
 * GET /api/chapters
 * POST /api/chapters
 * Chapter list and create endpoints (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, paginatedResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { chapterService } from "@/services";
import { ZodError } from "zod";
import { createChapterSchema } from "@/lib/validations/chapter.validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || undefined;
    const seriesId = searchParams.get("seriesId") || undefined;
    const unlockType = (searchParams.get("unlockType") as "FREE" | "AD" | "PREMIUM") || undefined;
    const sortBy = (searchParams.get("sortBy") as "chapterNumber" | "views" | "createdAt" | "updatedAt") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const { chapters, total } = await chapterService.getAllChapters({
      skip,
      take: limit,
      search,
      seriesId,
      unlockType,
      sortBy,
      sortOrder,
    });

    return paginatedResponse(chapters, total, page, limit, "Chapters retrieved successfully");
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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const body = await request.json();

    // Validate input using Zod
    const validatedData = createChapterSchema.parse(body);

    const chapter = await chapterService.createChapter({
      seriesId: validatedData.seriesId,
      chapterNumber: validatedData.chapterNumber,
      title: validatedData.title,
      slug: validatedData.slug,
      unlockType: validatedData.unlockType as any,
    });

    return createdResponse(chapter, "Chapter created successfully");
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
