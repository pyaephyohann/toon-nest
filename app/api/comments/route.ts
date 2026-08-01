/**
 * POST /api/comments
 * Create comment endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { commentService } from "@/services";

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
