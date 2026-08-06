/**
 * GET /api/admin/analytics/platform
 * Get platform analytics (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { analyticsService } from "@/services/analytics.service";
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
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;
    const period = searchParams.get("period") as "DAILY" | "WEEKLY" | "MONTHLY" | undefined;

    const analytics = await analyticsService.getPlatformAnalytics({
      startDate,
      endDate,
      period,
    });

    return successResponse(analytics, "Platform analytics retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
