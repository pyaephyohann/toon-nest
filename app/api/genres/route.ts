/**
 * GET /api/genres
 * POST /api/genres
 * Genres list and create endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, paginatedResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { genreService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;

    const { genres, total } = await genreService.findAll({ skip, take: limit });

    return paginatedResponse(genres, total, page, limit, "Genres retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Name is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const genre = await genreService.create(name, slug);

    return createdResponse(genre, "Genre created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
