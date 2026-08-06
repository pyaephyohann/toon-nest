/**
 * Global test setup
 */

import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global setup before all tests
beforeAll(() => {
  // Set test environment variables
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
});

// Global cleanup after all tests
afterAll(() => {
  // Cleanup resources
});
