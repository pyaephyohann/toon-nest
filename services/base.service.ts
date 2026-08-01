/**
 * Base Service
 * Provides common business logic patterns for all services
 * Follows Service Layer Pattern for business logic abstraction
 */

export abstract class BaseService {
  /**
   * Validate input data
   */
  protected validate<T>(data: T, schema: any): T {
    // Placeholder for validation logic
    // Will be implemented with Zod schemas
    return data;
  }

  /**
   * Handle errors consistently
   */
  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new Error(`Service Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred");
  }

  /**
   * Transform data for API response
   */
  protected transform<T, R>(data: T, transformer: (data: T) => R): R {
    return transformer(data);
  }
}
