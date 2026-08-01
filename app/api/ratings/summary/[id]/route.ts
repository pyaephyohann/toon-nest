/**
 * GET /api/ratings/summary/[id]
 * Rating summary endpoint
 */

import { NextRequest } from "next/server";
import { successResponse, handleApiError, errorResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { ratingService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const { average, count } = await ratingService.getAverageRating(id);

    // Get distribution
    const ratingsData = await ratingService.getRatingsBySeries(id, { take: 1000 });
    const ratings = ratingsData.ratings || [];
    const distribution = {
      5: ratings.filter((r: any) => r.rating === 5).length,
      4: ratings.filter((r: any) => r.rating === 4).length,
      3: ratings.filter((r: any) => r.rating === 3).length,
      2: ratings.filter((r: any) => r.rating === 2).length,
      1: ratings.filter((r: any) => r.rating === 1).length,
    };

    return successResponse(
      {
        averageRating: average,
        totalRatings: count,
        distribution,
      },
      "Rating summary retrieved successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
