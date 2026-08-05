/**
 * POST /api/payments/checkout
 * Create checkout session for subscription purchase
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { paymentService } from "@/services/payment.service";
import { SubscriptionPlan } from "@/app/generated/prisma/client";

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
    const { plan } = body;

    if (!plan) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Plan is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!Object.values(SubscriptionPlan).includes(plan)) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid subscription plan",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('host') || '';
    const successUrl = `${baseUrl}/premium?success=true`;
    const cancelUrl = `${baseUrl}/premium?canceled=true`;

    const checkoutSession = await paymentService.createCheckoutSession({
      userId: session.user.id,
      plan: plan as SubscriptionPlan,
      successUrl,
      cancelUrl,
    });

    return successResponse(checkoutSession, "Checkout session created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
