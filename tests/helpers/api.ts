/**
 * API test helpers
 */

import { NextRequest } from "next/server";

export const createMockRequest = (options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  url?: string;
}): NextRequest => {
  const { method = "GET", body, headers = {}, url = "http://localhost:3000" } = options;

  const request = new NextRequest(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return request;
};

export const createMockRouteContext = (params: Record<string, string>) => {
  return {
    params: Promise.resolve(params),
  };
};

export const parseResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { data: text };
  }
};
