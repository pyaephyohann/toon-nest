/**
 * GET /api/users/[id]
 * PATCH /api/users/[id]
 * DELETE /api/users/[id]
 * POST /api/users/[id]/suspend
 * POST /api/users/[id]/reactivate
 * User CRUD endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { userService } from "@/services";
import { ZodError } from "zod";
import { updateUserAdminSchema } from "@/lib/validations/user.validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        "User not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(user, "User retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get("admin") === "true";

    const body = await request.json();

    if (isAdmin) {
      // Admin mode - requires admin role
      if (session.user.role !== "ADMIN") {
        return errorResponse(
          ERROR_CODES.PERMISSION_DENIED,
          "Admin access required",
          HTTP_STATUS.FORBIDDEN
        );
      }

      // Validate input using Zod
      const validatedData = updateUserAdminSchema.parse(body);

      const user = await userService.updateUserAdmin(id, {
        ...validatedData,
        suspendedAt: validatedData.suspendedAt ? new Date(validatedData.suspendedAt) : null,
      });

      return successResponse(user, "User updated successfully");
    } else {
      // User mode - can only update own profile
      if (session.user.id !== id) {
        return errorResponse(
          ERROR_CODES.PERMISSION_DENIED,
          "Not authorized to update this user",
          HTTP_STATUS.FORBIDDEN
        );
      }

      const user = await userService.updateUserProfile(id, body);

      return successResponse(user, "User updated successfully");
    }
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
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get("admin") === "true";

    if (isAdmin) {
      // Admin mode - requires admin role
      if (session.user.role !== "ADMIN") {
        return errorResponse(
          ERROR_CODES.PERMISSION_DENIED,
          "Admin access required",
          HTTP_STATUS.FORBIDDEN
        );
      }

      await userService.deleteUserAdmin(id, session.user.id);

      return successResponse(null, "User deleted successfully");
    } else {
      // User mode - can only delete own account
      if (session.user.id !== id) {
        return errorResponse(
          ERROR_CODES.PERMISSION_DENIED,
          "Not authorized to delete this user",
          HTTP_STATUS.FORBIDDEN
        );
      }

      await userService.deleteUser(id);

      return successResponse(null, "User deleted successfully");
    }
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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const { id } = await context.params;
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    if (action === "suspend") {
      await userService.suspendUser(id);
      return successResponse(null, "User suspended successfully");
    }

    if (action === "reactivate") {
      await userService.reactivateUser(id);
      return successResponse(null, "User reactivated successfully");
    }

    return errorResponse(
      ERROR_CODES.VALIDATION_ERROR,
      "Invalid action. Use: suspend or reactivate",
      HTTP_STATUS.BAD_REQUEST
    );
  } catch (error) {
    return handleApiError(error);
  }
}
