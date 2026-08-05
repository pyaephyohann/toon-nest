/**
 * GET /api/payments/invoices/[id]
 * Get specific invoice by ID
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { paymentService } from "@/services/payment.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
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
    const invoice = await paymentService.getInvoiceById(id, session.user.id);

    if (!invoice) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        "Invoice not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(invoice, "Invoice retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
