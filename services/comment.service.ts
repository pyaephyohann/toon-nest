/**
 * Comment Service
 * Manages chapter comments with authorization
 */

import { commentRepository, chapterRepository } from "@/repositories";

export class CommentService {
  /**
   * Get comments for a chapter with pagination
   */
  async getCommentsByChapter(
    chapterId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return commentRepository.findByChapterId(chapterId, options);
  }

  /**
   * Get specific comment by ID
   */
  async getCommentById(id: string) {
    return commentRepository.findById(id);
  }

  /**
   * Add a comment
   */
  async addComment(userId: string, chapterId: string, content: string) {
    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (content.length > 1000) {
      throw new Error("Comment content too long (max 1000 characters)");
    }

    // Check if chapter exists
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    return commentRepository.create(userId, chapterId, content.trim());
  }

  /**
   * Update comment (owner only)
   */
  async updateComment(id: string, userId: string, content: string) {
    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (content.length > 1000) {
      throw new Error("Comment content too long (max 1000 characters)");
    }

    // Check if comment exists and belongs to user
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Not authorized to update this comment");
    }

    return commentRepository.update(id, content.trim());
  }

  /**
   * Delete comment (owner only)
   */
  async deleteComment(id: string, userId: string) {
    // Check if comment exists and belongs to user
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Not authorized to delete this comment");
    }

    return commentRepository.delete(id);
  }
}

export const commentService = new CommentService();
