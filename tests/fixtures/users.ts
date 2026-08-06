/**
 * User test fixtures
 */

export const mockUser = {
  id: "test-user-id",
  username: "testuser",
  email: "test@example.com",
  password: "hashedpassword",
  avatar: null,
  displayName: "Test User",
  bio: "Test user bio",
  readingStreak: 0,
  role: "USER",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

export const mockAdminUser = {
  id: "admin-user-id",
  username: "admin",
  email: "admin@example.com",
  password: "hashedpassword",
  avatar: null,
  displayName: "Admin User",
  bio: "Admin user bio",
  readingStreak: 0,
  role: "ADMIN",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

export const mockUserList = [
  mockUser,
  mockAdminUser,
  {
    id: "user-3",
    username: "user3",
    email: "user3@example.com",
    password: "hashedpassword",
    avatar: null,
    displayName: "User Three",
    bio: "Third user",
    readingStreak: 5,
    role: "USER",
    createdAt: new Date("2024-01-02T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  },
];
