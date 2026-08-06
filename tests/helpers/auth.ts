/**
 * Auth test helpers
 */

import { mockSession, mockAdminSession } from "../mocks/next-auth";

export const getMockAuth = (isAdmin = false) => {
  return isAdmin ? mockAdminSession : mockSession;
};

export const getMockUserId = (isAdmin = false) => {
  return isAdmin ? "admin-user-id" : "test-user-id";
};

export const getMockUserRole = (isAdmin = false) => {
  return isAdmin ? "ADMIN" : "USER";
};
