/**
 * GET /api/payments/invoices
 * Get billing history for authenticated user
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { paymentService } from "@/services/payment.service";

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

    const invoices = await paymentService.getInvoices(session.user.id);

    return successResponse(invoices, "Invoices retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
