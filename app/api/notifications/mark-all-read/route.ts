/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { notificationService } from "@/services";

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

    const { count } = await notificationService.markAllAsRead(session.user.id);

    return successResponse({ count }, "All notifications marked as read");
  } catch (error) {
    return handleApiError(error);
  }
}
