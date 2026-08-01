/**
 * GET /api/manga/[id]/ratings
 * Get ratings for a series
 */

import { NextRequest } from "next/server";
import { successResponse, handleApiError, errorResponse, paginatedResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from "@/lib/api/index";
import { ratingService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    const { ratings, total } = await ratingService.getRatingsBySeries(id, {
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginatedResponse(ratings, total, page, limit, "Ratings retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
