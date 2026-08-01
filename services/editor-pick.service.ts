/**
 * Editor Pick Service
 * Manages editor-featured series with authorization
 */

import { editorPickRepository, seriesRepository } from "@/repositories";

export class EditorPickService {
  /**
   * Get all editor picks with pagination
   */
  async getAllEditorPicks(options?: {
    skip?: number;
    take?: number;
  }) {
    return editorPickRepository.findAll(options);
  }

  /**
   * Get specific editor pick by ID
   */
  async getEditorPickById(id: string) {
    return editorPickRepository.findById(id);
  }

  /**
   * Create editor pick (admin only - authorization handled by caller)
   */
  async createEditorPick(seriesId: string) {
    // Check if series exists
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Create editor pick (database has unique constraint on seriesId)
    return editorPickRepository.create(seriesId);
  }

  /**
   * Delete editor pick (admin only - authorization handled by caller)
   */
  async deleteEditorPick(id: string) {
    const existing = await editorPickRepository.findById(id);
    if (!existing) {
      throw new Error("Editor pick not found");
    }

    return editorPickRepository.delete(id);
  }

  /**
   * Remove editor pick by series (admin only - authorization handled by caller)
   */
  async removeEditorPickBySeries(seriesId: string) {
    // Delete by seriesId directly (database has unique constraint)
    return editorPickRepository.deleteBySeriesId(seriesId);
  }

  /**
   * Get picks by date range
   */
  async getPicksByDateRange(startDate: Date, endDate: Date) {
    return editorPickRepository.findByDateRange(startDate, endDate);
  }
}

export const editorPickService = new EditorPickService();
