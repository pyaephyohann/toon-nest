/**
 * NextAuth mock
 */

import { vi } from "vitest";

export const mockAuth = vi.fn(() => ({
  user: {
    id: "test-user-id",
    username: "testuser",
    email: "test@example.com",
    role: "USER",
  },
}));

export const mockSession = {
  user: {
    id: "test-user-id",
    username: "testuser",
    email: "test@example.com",
    role: "USER",
  },
  expires: new Date(Date.now() + 3600000).toISOString(),
};

export const mockAdminSession = {
  user: {
    id: "admin-user-id",
    username: "admin",
    email: "admin@example.com",
    role: "ADMIN",
  },
  expires: new Date(Date.now() + 3600000).toISOString(),
};
