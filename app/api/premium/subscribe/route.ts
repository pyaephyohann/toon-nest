/**
 * POST /api/premium/subscribe
 * Create subscription endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { subscriptionService } from "@/services";

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
    const { plan, duration } = body;

    if (!plan || !duration) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Plan and duration are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const subscription = await subscriptionService.createSubscription(session.user.id, plan, duration);

    return createdResponse(subscription, "Subscription created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
