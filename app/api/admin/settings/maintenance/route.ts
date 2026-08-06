/**
 * GET /api/admin/settings/maintenance
 * PUT /api/admin/settings/maintenance
 * Maintenance settings endpoints (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { settingsService } from "@/services/settings.service";
import { requireAdmin } from "@/lib/access-control";
import { ZodError } from "zod";

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

    await requireAdmin(session.user.id);

    const settings = await settingsService.getMaintenanceSettings();
    return successResponse(settings, "Maintenance settings retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse(
        ERROR_CODES.AUTH_REQUIRED,
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await requireAdmin(session.user.id);

    const body = await request.json();
    const settings = await settingsService.updateMaintenanceSettings(body);
    return successResponse(settings, "Maintenance settings updated successfully");
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
