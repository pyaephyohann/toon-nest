/**
 * GET /api/manga
 * POST /api/manga
 * Manga (Series) list and create endpoints
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, paginatedResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { seriesService } from "@/services";
import { ZodError } from "zod";
import { createMangaSchema } from "@/lib/validations/manga.validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;
    const status = (searchParams.get("status") as any) || undefined;
    const genreId = searchParams.get("genreId") || undefined;
    const search = searchParams.get("search") || undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
    const timePeriod = (searchParams.get("timePeriod") as "daily" | "weekly" | "monthly" | "all") || undefined;
    const orderByField = (searchParams.get("orderByField") as any) || undefined;
    const orderByDirection = (searchParams.get("orderByDirection") as any) || undefined;

    const { series, total } = await seriesService.getAllSeries({
      skip,
      take: limit,
      status,
      genreId,
      search,
      year,
      timePeriod,
      orderBy: orderByField && orderByDirection ? {
        field: orderByField,
        direction: orderByDirection,
      } : undefined,
    });

    return paginatedResponse(series, total, page, limit, "Series retrieved successfully");
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
    const validatedData = createMangaSchema.parse(body);

    const series = await seriesService.createSeries({
      title: validatedData.title,
      slug: validatedData.slug,
      description: validatedData.description,
      coverImage: validatedData.coverImage,
      bannerImage: validatedData.bannerImage,
      author: validatedData.author,
      artist: validatedData.artist,
      status: validatedData.status as any,
      genreIds: validatedData.genreIds,
      tagIds: validatedData.tagIds,
    });

    return createdResponse(series, "Series created successfully");
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
