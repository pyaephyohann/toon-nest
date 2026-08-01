/**
 * GET /api/comments/[id]
 * PATCH /api/comments/[id]
 * DELETE /api/comments/[id]
 * Comment CRUD endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { commentService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const comment = await commentService.getCommentById(id);

    if (!comment) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        "Comment not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(comment, "Comment retrieved successfully");
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

    const comment = await commentService.updateComment(id, session.user.id, content);

    return successResponse(comment, "Comment updated successfully");
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

    const { id } = await context.params;

    await commentService.deleteComment(id, session.user.id);

    return successResponse(null, "Comment deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
