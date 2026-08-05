/**
 * GET /api/genres/[id]
 * PATCH /api/genres/[id]
 * DELETE /api/genres/[id]
 * Genre CRUD endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { genreService } from "@/services";
import { ZodError } from "zod";
import { updateGenreSchema } from "@/lib/validations/genre.validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const genre = await genreService.findById(id);

    if (!genre) {
      return errorResponse(
        ERROR_CODES.NOT_FOUND,
        "Genre not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(genre, "Genre retrieved successfully");
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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    // Validate input using Zod
    const validatedData = updateGenreSchema.parse(body);

    const genre = await genreService.update(id, validatedData);

    return successResponse(genre, "Genre updated successfully");
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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return errorResponse(
        ERROR_CODES.PERMISSION_DENIED,
        "Admin access required",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const { id } = await context.params;

    await genreService.delete(id);

    return successResponse(null, "Genre deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
