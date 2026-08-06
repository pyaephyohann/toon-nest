/**
 * User Repository
 * Handles all user-related database operations
 */

import prisma from "@/lib/prisma";
import { User, UserRole } from "@/app/generated/prisma/client";

export class UserRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Create a new user
   */
  async create(data: {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    role?: UserRole;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update user
   */
  async update(
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      avatar?: string;
      role?: UserRole;
      suspendedAt?: Date | null;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Check if username exists
   */
  async usernameExists(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return user !== null;
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(userId: string) {
    const [bookmarksCount, historyCount, ratingsCount, commentsCount] = await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.readingHistory.count({ where: { userId } }),
      prisma.rating.count({ where: { userId } }),
      prisma.comment.count({ where: { userId } }),
    ]);

    // Count unique manga read (from history)
    const historyEntries = await prisma.readingHistory.findMany({
      where: { userId },
      include: {
        chapter: {
          select: {
            seriesId: true,
          },
        },
      },
    });

    const uniqueMangaRead = new Set(historyEntries.map((h) => h.chapter.seriesId)).size;

    return {
      bookmarksCount,
      historyCount,
      ratingsCount,
      commentsCount,
      uniqueMangaRead,
      readingStreak: 0, // Will be calculated in service layer
    };
  }

  /**
   * Get user's favorite genres based on activity
   */
  async getFavoriteGenres(userId: string, limit: number = 5) {
    // Get genres from bookmarked series
    const bookmarkedSeries = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        series: {
          include: {
            genres: {
              include: {
                genre: true,
              },
            },
          },
        },
      },
    });

    // Get genres from reading history
    const historyEntries = await prisma.readingHistory.findMany({
      where: { userId },
      include: {
        chapter: {
          include: {
            series: {
              include: {
                genres: {
                  include: {
                    genre: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Aggregate genre counts
    const genreCounts = new Map<string, number>();

    // Weight bookmarks higher (2x)
    bookmarkedSeries.forEach((bookmark) => {
      bookmark.series.genres.forEach((sg) => {
        const genreName = sg.genre.name;
        genreCounts.set(genreName, (genreCounts.get(genreName) || 0) + 2);
      });
    });

    // Weight reading history (1x)
    historyEntries.forEach((history) => {
      history.chapter.series.genres.forEach((sg) => {
        const genreName = sg.genre.name;
        genreCounts.set(genreName, (genreCounts.get(genreName) || 0) + 1);
      });
    });

    // Sort by count and return top genres
    const sortedGenres = Array.from(genreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));

    return sortedGenres;
  }

  /**
   * Get total users count (admin)
   */
  async getTotalUsers(): Promise<number> {
    return prisma.user.count();
  }

  /**
   * Get premium users count (admin)
   */
  async getPremiumUsersCount(): Promise<number> {
    return prisma.user.count({
      where: {
        subscriptions: {
          some: {
            status: "ACTIVE",
            expiresAt: {
              gt: new Date(),
            },
          },
        },
      },
    });
  }

  /**
   * Get recent users (admin)
   */
  async getRecentUsers(limit: number = 10) {
    return prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        suspendedAt: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find all users globally (admin)
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    search?: string;
    role?: "USER" | "ADMIN";
    isSuspended?: boolean;
    sortBy?: "createdAt" | "username" | "readingStreak";
    sortOrder?: "asc" | "desc";
  }): Promise<{ users: Omit<User, "password">[]; total: number }> {
    const { skip = 0, take = 20, search, role, isSuspended, sortBy = "createdAt", sortOrder = "desc" } = options || {};

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (isSuspended !== undefined) {
      where.suspendedAt = isSuspended ? { not: null } : null;
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { displayName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          displayName: true,
          bio: true,
          role: true,
          readingStreak: true,
          suspendedAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              bookmarks: true,
              history: true,
              comments: true,
              ratings: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users: users as Omit<User, "password">[], total };
  }

  /**
   * Count users by role
   */
  async countByRole(role: "USER" | "ADMIN"): Promise<number> {
    return prisma.user.count({
      where: { role },
    });
  }

  /**
   * Count suspended users
   */
  async countSuspended(): Promise<number> {
    return prisma.user.count({
      where: {
        suspendedAt: { not: null },
      },
    });
  }
}

export const userRepository = new UserRepository();
