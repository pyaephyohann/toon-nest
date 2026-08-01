/**
 * POST /api/ratings
 * Create/update rating endpoint
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { ratingService } from "@/services";

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

    const body = await request.json();
    const { seriesId, rating } = body;

    if (!seriesId || !rating) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "SeriesId and rating are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const rated = await ratingService.rateSeries(session.user.id, seriesId, rating);

    return createdResponse(rated, "Rating saved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
