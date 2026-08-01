/**
 * GET /api/chapters/[id]/comments
 * POST /api/chapters/[id]/comments
 * Chapter comments endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse, paginatedResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { commentService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    const { comments, total } = await commentService.getCommentsByChapter(id, {
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginatedResponse(comments, total, page, limit, "Comments retrieved successfully");
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

    const { id } = await context.params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Content is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const comment = await commentService.addComment(session.user.id, id, content);

    return createdResponse(comment, "Comment added successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
