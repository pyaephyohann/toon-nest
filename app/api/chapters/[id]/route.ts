/**
 * GET /api/chapters/[id]
 * PATCH /api/chapters/[id]
 * DELETE /api/chapters/[id]
 * Chapter CRUD endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { chapterService } from "@/services";
import { checkPremiumAccess } from "@/lib/access-control";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await auth();
    const userId = session?.user?.id || null;

    const chapter = await chapterService.getChapterWithAccessInfo(id, userId);

    // Check access for premium chapters
    if (chapter.unlockType === "PREMIUM" && !chapter.access.canAccess) {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "This chapter requires a premium subscription",
        HTTP_STATUS.FORBIDDEN
      );
    }

    return successResponse(chapter, "Chapter retrieved successfully");
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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const chapter = await chapterService.updateChapter(id, body);

    return successResponse(chapter, "Chapter updated successfully");
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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const { id } = await context.params;

    await chapterService.deleteChapter(id);

    return successResponse(null, "Chapter deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
