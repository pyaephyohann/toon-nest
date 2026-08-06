/**
 * GET /api/admin/moderation/history
 * Get moderation history (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, paginatedResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { moderationService } from "@/services/moderation.service";
import { requireAdmin } from "@/lib/access-control";

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

    // Check admin role
    await requireAdmin(session.user.id);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;
    const actionType = (searchParams.get("actionType") as "APPROVE" | "DELETE" | "HIDE" | "WARN" | "SUSPEND" | "BAN") || undefined;
    const targetType = (searchParams.get("targetType") as "COMMENT" | "RATING" | "USER") || undefined;
    const targetId = searchParams.get("targetId") || undefined;
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    const { actions, total } = await moderationService.getModerationHistory({
      skip,
      take: limit,
      actionType,
      targetType,
      targetId,
      startDate,
      endDate,
    });

    return paginatedResponse(actions, total, page, limit, "Moderation history retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
