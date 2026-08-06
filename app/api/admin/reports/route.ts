/**
 * GET /api/admin/reports
 * List reports (admin only)
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
    const status = (searchParams.get("status") as "PENDING" | "RESOLVED" | "DISMISSED") || undefined;
    const targetType = (searchParams.get("targetType") as "COMMENT" | "RATING" | "USER") || undefined;
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    const { reports, total } = await moderationService.getReports({
      skip,
      take: limit,
      status,
      targetType,
      startDate,
      endDate,
    });

    return paginatedResponse(reports, total, page, limit, "Reports retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
