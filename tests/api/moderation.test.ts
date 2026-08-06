/**
 * Moderation API Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/admin/reports/route";
import { createMockRequest, parseResponse } from "../helpers/api";

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock moderation service
vi.mock("@/services/moderation.service", () => ({
  moderationService: {
    getReports: vi.fn(),
    createReport: vi.fn(),
  },
}));

// Mock requireAdmin
vi.mock("@/lib/access-control", () => ({
  requireAdmin: vi.fn(),
}));

import { auth } from "@/auth";
import { moderationService } from "@/services/moderation.service";
import { requireAdmin } from "@/lib/access-control";

describe("Moderation API - Reports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/reports", () => {
    it("should return reports for admin", async () => {
      const mockSession = {
        user: {
          id: "admin-1",
          role: "ADMIN",
        },
      };

      const mockReports = [
        {
          id: "report-1",
          reporterId: "user-1",
          targetType: "COMMENT" as const,
          targetId: "comment-1",
          reason: "Spam",
          description: null,
          status: "PENDING" as const,
          moderatorId: null,
          resolvedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          reporter: {
            id: "user-1",
            username: "user1",
            avatar: null,
          },
          moderator: null,
        },
      ];

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(requireAdmin).mockResolvedValue(undefined as any);
      vi.mocked(moderationService.getReports).mockResolvedValue({
        reports: mockReports,
        total: 1,
      });

      const request = createMockRequest({
        method: "GET",
        url: "http://localhost:3000/api/admin/reports?status=PENDING",
      });
      const response = await GET(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.reports).toHaveLength(1);
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
});
