/**
 * API Response Utilities
 * Standardized response helpers for Next.js Route Handlers
 */

import { NextResponse } from "next/server";

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T = any> {
  success: true;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

/**
 * Standard success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Standard error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

/**
 * Paginated response
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  message?: string,
  status: number = 200
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
      },
      message,
    },
    { status }
  );
}

/**
 * Created response (201)
 */
export function createdResponse<T>(
  data: T,
  message: string = "Resource created successfully"
): NextResponse<SuccessResponse<T>> {
  return successResponse(data, message, 201);
}

/**
 * No content response (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
