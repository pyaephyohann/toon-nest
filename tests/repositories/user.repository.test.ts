/**
 * User Repository Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { userRepository } from "@/repositories/user.repository";
import { mockUser } from "../fixtures/users";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";

describe("UserRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should find a user by id", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      
      const result = await userRepository.findById("test-user-id");
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "test-user-id" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      
      const result = await userRepository.findById("non-existent-id");
      
      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      
      const result = await userRepository.findByEmail("test@example.com");
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const newUser = {
        username: "newuser",
        email: "new@example.com",
        password: "hashedpassword",
      };
      
      vi.mocked(prisma.user.create).mockResolvedValue({ ...mockUser, ...newUser } as any);
      
      const result = await userRepository.create(newUser);
      
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser,
      });
      expect(result).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const updateData = { username: "updateduser" };
      vi.mocked(prisma.user.update).mockResolvedValue({ ...mockUser, ...updateData } as any);
      
      const result = await userRepository.update("test-user-id", updateData);
      
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "test-user-id" },
        data: updateData,
      });
      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);
      
      const result = await userRepository.delete("test-user-id");
      
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: "test-user-id" },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("findAll", () => {
    it("should find all users with pagination", async () => {
      const users = [mockUser];
      vi.mocked(prisma.user.findMany).mockResolvedValue(users as any);
      
      const result = await userRepository.findAll({ skip: 0, take: 10 });
      
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(users);
    });
  });
});
