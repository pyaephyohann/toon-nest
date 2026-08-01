/**
 * DELETE /api/premium/subscriptions/[id]
 * Cancel subscription endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { subscriptionService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    await subscriptionService.cancelSubscription(id);

    return successResponse(null, "Subscription cancelled successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
