/**
 * GET /api/notifications/unread-count
 * Unread notification count endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { notificationService } from "@/services";

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

    const count = await notificationService.getUnreadCount(session.user.id);

    return successResponse({ count }, "Unread count retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
