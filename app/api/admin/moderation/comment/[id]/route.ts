/**
 * POST /api/admin/moderation/comment/[id]
 * Moderate comment endpoint (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { moderationService } from "@/services/moderation.service";
import { requireAdmin } from "@/lib/access-control";
import { ZodError } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
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

    // Check admin role
    await requireAdmin(session.user.id);

    const { id } = await context.params;
    const body = await request.json();

    const result = await moderationService.moderateComment(id, {
      moderatorId: session.user.id,
      action: body.action,
      reason: body.reason,
    });

    return successResponse(result, "Comment moderated successfully");
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
