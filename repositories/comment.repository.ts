/**
 * Comment Repository
 * Handles all comment database operations
 */

import prisma from "@/lib/prisma";
import { Comment } from "@/app/generated/prisma/client";

export class CommentRepository {
  /**
   * Find comments for a chapter with pagination
   */
  async findByChapterId(
    chapterId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ comments: Comment[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { chapterId },
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.comment.count({
        where: { chapterId },
      }),
    ]);

    return { comments, total };
  }

  /**
   * Find a comment by ID
   */
  async findById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        chapter: {
          include: {
            series: true,
          },
        },
      },
    });
  }

  /**
   * Create a comment
   */
  async create(
    userId: string,
    chapterId: string,
    content: string
  ): Promise<Comment> {
    return prisma.comment.create({
      data: {
        userId,
        chapterId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        chapter: true,
      },
    });
  }

  /**
   * Update a comment
   */
  async update(id: string, content: string): Promise<Comment> {
    return prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        chapter: true,
      },
    });
  }

  /**
   * Delete a comment
   */
  async delete(id: string): Promise<Comment> {
    return prisma.comment.delete({
      where: { id },
    });
  }

  /**
   * Count comments for a chapter
   */
  async countByChapterId(chapterId: string): Promise<number> {
    return prisma.comment.count({
      where: { chapterId },
    });
  }
}

export const commentRepository = new CommentRepository();
