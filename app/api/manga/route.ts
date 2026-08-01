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
    const orderByField = (searchParams.get("orderByField") as any) || undefined;
    const orderByDirection = (searchParams.get("orderByDirection") as any) || undefined;

    const { series, total } = await seriesService.getAllSeries({
      skip,
      take: limit,
      status,
      genreId,
      search,
      year,
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
    const { title, slug, description, coverImage, bannerImage, author, artist, status, genreIds, tagIds } = body;

    if (!title || !slug || !description || !coverImage) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Title, slug, description, and coverImage are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const series = await seriesService.createSeries({
      title,
      slug,
      description,
      coverImage,
      bannerImage,
      author,
      artist,
      status,
      genreIds,
      tagIds,
    });

    return createdResponse(series, "Series created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
