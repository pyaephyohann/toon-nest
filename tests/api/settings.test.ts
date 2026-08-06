/**
 * Settings API Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PUT } from "@/app/api/admin/settings/general/route";
import { createMockRequest, createMockRouteContext, parseResponse } from "../helpers/api";

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock settings service
vi.mock("@/services/settings.service", () => ({
  settingsService: {
    getGeneralSettings: vi.fn(),
    updateGeneralSettings: vi.fn(),
  },
}));

// Mock requireAdmin
vi.mock("@/lib/access-control", () => ({
  requireAdmin: vi.fn(),
}));

import { auth } from "@/auth";
import { settingsService } from "@/services/settings.service";
import { requireAdmin } from "@/lib/access-control";

describe("Settings API - General", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/settings/general", () => {
    it("should return general settings for admin", async () => {
      const mockSession = {
        user: {
          id: "admin-1",
          role: "ADMIN",
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(requireAdmin).mockResolvedValue(undefined as any);
      vi.mocked(settingsService.getGeneralSettings).mockResolvedValue({
        siteName: "ToonNest",
        theme: "light",
      });

      const request = createMockRequest({ method: "GET" });
      const response = await GET(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.siteName).toBe("ToonNest");
    });

    it("should return 401 if not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const request = createMockRequest({ method: "GET" });
      const response = await GET(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });

  describe("PUT /api/admin/settings/general", () => {
    it("should update general settings for admin", async () => {
      const mockSession = {
        user: {
          id: "admin-1",
          role: "ADMIN",
        },
      };

      const updateData = {
        siteName: "New Name",
        theme: "dark",
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(requireAdmin).mockResolvedValue(undefined);
      vi.mocked(settingsService.updateGeneralSettings).mockResolvedValue(updateData);

      const request = createMockRequest({
        method: "PUT",
        body: updateData,
      });
      const response = await PUT(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.siteName).toBe("New Name");
    });

    it("should return 401 if not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const request = createMockRequest({
        method: "PUT",
        body: { siteName: "New Name" },
      });
      const response = await PUT(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });
});
