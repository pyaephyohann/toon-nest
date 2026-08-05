/**
 * GET /api/admin/dashboard/recent-activity
 * Get recent activity (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { adminService } from "@/services/admin.service";
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

    // Get limit from query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const recentActivity = await adminService.getRecentActivity(limit);

    return successResponse(recentActivity, "Recent activity retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
