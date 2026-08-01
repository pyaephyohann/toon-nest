/**
 * GET /api/comments
 * POST /api/comments
 * Comment endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { commentService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "newest";

    if (!chapterId) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "ChapterId is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const { comments, total } = await commentService.getCommentsByChapter(
      chapterId,
      {
        skip: (page - 1) * limit,
        take: limit,
      }
    );

    return successResponse(
      { items: comments, total, page, limit },
      "Comments retrieved successfully"
    );
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
    const { chapterId, content } = body;

    if (!chapterId || !content) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "ChapterId and content are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const comment = await commentService.addComment(session.user.id, chapterId, content);

    return createdResponse(comment, "Comment added successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
