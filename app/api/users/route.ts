/**
 * GET /api/users
 * Global user list endpoint (admin only)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, paginatedResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { userService } from "@/services";

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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || undefined;
    const role = (searchParams.get("role") as "USER" | "ADMIN") || undefined;
    const isSuspended = searchParams.get("isSuspended") === "true" ? true : searchParams.get("isSuspended") === "false" ? false : undefined;
    const sortBy = (searchParams.get("sortBy") as "createdAt" | "username" | "readingStreak") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const { users, total } = await userService.getAllUsers({
      skip,
      take: limit,
      search,
      role,
      isSuspended,
      sortBy,
      sortOrder,
    });

    return paginatedResponse(users, total, page, limit, "Users retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
