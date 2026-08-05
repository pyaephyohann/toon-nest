/**
 * POST /api/premium/subscriptions/[id]/auto-renew
 * Toggle auto-renew for subscription
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { subscriptionService } from "@/services";

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
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Enabled field is required and must be a boolean",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const subscription = await subscriptionService.toggleAutoRenew(id, enabled);

    return successResponse(subscription, "Auto-renew updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
