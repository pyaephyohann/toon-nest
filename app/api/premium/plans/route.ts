/**
 * GET /api/premium/plans
 * Get available subscription plans endpoint
 */

import { NextRequest } from "next/server";
import { successResponse, handleApiError } from "@/lib/api/index";
import { subscriptionService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    // Seed default plans if they don't exist
    await subscriptionService.seedDefaultPlans();

    const plans = await subscriptionService.getAvailablePlans();

    return successResponse(plans, "Plans retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
