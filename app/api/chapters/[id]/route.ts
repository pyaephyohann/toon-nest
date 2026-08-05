/**
 * GET /api/chapters/[id]
 * PATCH /api/chapters/[id]
 * DELETE /api/chapters/[id]
 * POST /api/chapters/[id]/duplicate
 * POST /api/chapters/[id]/pages
 * PATCH /api/chapters/[id]/pages/reorder
 * Chapter CRUD endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { chapterService } from "@/services";
import { checkPremiumAccess } from "@/lib/access-control";
import { ZodError } from "zod";
import { updateChapterSchema, createChapterPagesSchema, reorderChapterPagesSchema } from "@/lib/validations/chapter.validation";

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

    // Validate input using Zod
    const validatedData = updateChapterSchema.parse(body);

    const chapter = await chapterService.updateChapter(id, {
      ...validatedData,
      unlockType: validatedData.unlockType as any,
    });

    return successResponse(chapter, "Chapter updated successfully");
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

export async function POST(request: NextRequest, context: RouteContext) {
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
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    if (action === "duplicate") {
      const body = await request.json();
      const { newChapterNumber } = body;

      if (!newChapterNumber) {
        return errorResponse(
          ERROR_CODES.VALIDATION_ERROR,
          "newChapterNumber is required",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const chapter = await chapterService.duplicateChapter(id, newChapterNumber);
      return successResponse(chapter, "Chapter duplicated successfully");
    }

    if (action === "upload-pages") {
      const body = await request.json();

      // Validate input using Zod
      const validatedData = createChapterPagesSchema.parse({ chapterId: id, pages: body.pages });

      const chapter = await chapterService.bulkUploadPages(id, validatedData.pages.map((p) => p.imageUrl));
      return successResponse(chapter, "Chapter pages uploaded successfully");
    }

    if (action === "reorder-pages") {
      const body = await request.json();

      // Validate input using Zod
      const validatedData = reorderChapterPagesSchema.parse(body);

      await chapterService.reorderPages(validatedData.pageOrders);
      return successResponse(null, "Chapter pages reordered successfully");
    }

    return errorResponse(
      ERROR_CODES.VALIDATION_ERROR,
      "Invalid action. Use: duplicate, upload-pages, or reorder-pages",
      HTTP_STATUS.BAD_REQUEST
    );
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
