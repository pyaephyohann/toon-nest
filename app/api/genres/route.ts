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
import { ZodError } from "zod";
import { createGenreSchema } from "@/lib/validations/genre.validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as "name" | "createdAt" | "seriesCount") || "name";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    const hasIcon = searchParams.get("hasIcon") === "true" ? true : searchParams.get("hasIcon") === "false" ? false : undefined;
    const hasColor = searchParams.get("hasColor") === "true" ? true : searchParams.get("hasColor") === "false" ? false : undefined;

    const { genres, total } = await genreService.findAll({
      skip,
      take: limit,
      search,
      sortBy,
      sortOrder,
      hasIcon,
      hasColor,
    });

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

    // Validate input using Zod
    const validatedData = createGenreSchema.parse(body);

    const genre = await genreService.create(
      validatedData.name,
      validatedData.slug,
      validatedData.icon,
      validatedData.color
    );

    return createdResponse(genre, "Genre created successfully");
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
