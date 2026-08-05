/**
 * POST /api/premium/subscriptions/[id]/upgrade
 * Upgrade or downgrade subscription
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { subscriptionService } from "@/services";
import { SubscriptionPlan } from "@/app/generated/prisma/client";

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

    const { id } = await context.params;
    const body = await request.json();
    const { newPlan } = body;

    if (!newPlan) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "New plan is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!Object.values(SubscriptionPlan).includes(newPlan)) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid subscription plan",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const subscription = await subscriptionService.upgradeSubscription(session.user.id, newPlan);

    return createdResponse(subscription, "Subscription upgraded successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
