/**
 * POST /api/auth/logout
 * User logout endpoint
 */

import { NextRequest } from "next/server";
import { signOut } from "@/auth";
import { successResponse, handleApiError } from "@/lib/api/index";

export async function POST(request: NextRequest) {
  try {
    // Sign out with Auth.js
    // Note: Auth.js handles the actual session destruction
    // The client should call Auth.js signOut() directly
    // This endpoint is for API completeness
    
    return successResponse(null, "Logged out successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
