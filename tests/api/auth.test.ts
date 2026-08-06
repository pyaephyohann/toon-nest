/**
 * Authentication API Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/auth/login/route";
import { POST as RegisterPOST } from "@/app/api/auth/register/route";
import { createMockRequest, parseResponse } from "../helpers/api";

// Mock auth service
vi.mock("@/services/auth.service", () => ({
  authService: {
    validateCredentials: vi.fn(),
    register: vi.fn(),
  },
}));

import { authService } from "@/services/auth.service";

describe("Authentication API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        id: "user-1",
        email: "test@example.com",
        username: "testuser",
        role: "USER",
      };

      vi.mocked(authService.validateCredentials).mockResolvedValue(mockResponse as any);

      const request = createMockRequest({
        method: "POST",
        body: loginData,
      });
      const response = await POST(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe("test@example.com");
    });

    it("should return 401 with invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      vi.mocked(authService.validateCredentials).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: loginData,
      });
      const response = await POST(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register with valid data", async () => {
      const registerData = {
        username: "newuser",
        email: "new@example.com",
        password: "password123",
      };

      const mockResponse = {
        user: {
          id: "user-1",
          email: "new@example.com",
          username: "newuser",
        },
        token: "mock-jwt-token",
      };

      vi.mocked(authService.register).mockResolvedValue(mockResponse as any);

      const request = createMockRequest({
        method: "POST",
        body: registerData,
      });
      const response = await RegisterPOST(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.user.username).toBe("newuser");
    });

    it("should return 400 with invalid data", async () => {
      const registerData = {
        username: "newuser",
        email: "invalid-email",
        password: "123",
      };

      vi.mocked(authService.register).mockRejectedValue(new Error("Invalid email"));

      const request = createMockRequest({
        method: "POST",
        body: registerData,
      });
      const response = await RegisterPOST(request);

      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
