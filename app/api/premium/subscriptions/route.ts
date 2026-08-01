/**
 * GET /api/premium/subscriptions
 * Get user subscriptions endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { subscriptionService } from "@/services";

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

    const subscriptions = await subscriptionService.getUserSubscriptions(session.user.id);

    return successResponse(subscriptions, "Subscriptions retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
