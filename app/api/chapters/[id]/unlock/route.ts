/**
 * POST /api/chapters/[id]/unlock
 * Unlock chapter endpoint (premium/AD)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { successResponse, handleApiError, errorResponse, createdResponse } from "@/lib/api/index";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/api/index";
import { chapterService } from "@/services";

interface RouteContext {
  params: Promise<{ id: string }>;
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

    const { id } = await context.params;
    const body = await request.json();
    const { method } = body; // 'premium' or 'ad'

    if (!method) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Unlock method is required (premium or ad)",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let unlock;
    if (method === "premium") {
      unlock = await chapterService.unlockChapterForUser(session.user.id, id);
    } else if (method === "ad") {
      unlock = await chapterService.unlockChapterWithAd(session.user.id, id);
    } else {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid unlock method. Use 'premium' or 'ad'",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    return createdResponse(unlock, "Chapter unlocked successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
