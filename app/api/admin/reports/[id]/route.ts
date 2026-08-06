/**
 * GET /api/admin/reports/[id]
 * POST /api/admin/reports/[id]/resolve
 * POST /api/admin/reports/[id]/dismiss
 * Report management endpoints (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { moderationService } from "@/services/moderation.service";
import { requireAdmin } from "@/lib/access-control";
import { ZodError } from "zod";

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

    // Check admin role
    await requireAdmin(session.user.id);

    const { id } = await context.params;
    const report = await moderationService.getReportById(id);

    if (!report) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        "Report not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(report, "Report retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
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

    // Check admin role
    await requireAdmin(session.user.id);

    const { id } = await context.params;
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    if (action === "resolve") {
      const report = await moderationService.resolveReport(id, session.user.id);
      return successResponse(report, "Report resolved successfully");
    }

    if (action === "dismiss") {
      const body = await request.json();
      const report = await moderationService.dismissReport(id, session.user.id, body.reason);
      return successResponse(report, "Report dismissed successfully");
    }

    return errorResponse(
      ERROR_CODES.VALIDATION_ERROR,
      "Invalid action. Use: resolve or dismiss",
      HTTP_STATUS.BAD_REQUEST
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        error.issues[0].message,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    return handleApiError(error);
  }
}
