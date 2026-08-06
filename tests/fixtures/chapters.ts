/**
 * Chapter test fixtures
 */

export const mockChapter = {
  id: "test-chapter-id",
  mangaId: "test-manga-id",
  chapterNumber: 1,
  title: "Chapter 1",
  content: "Test chapter content",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

export const mockChapterList = [
  mockChapter,
  {
    id: "chapter-2",
    mangaId: "test-manga-id",
    chapterNumber: 2,
    title: "Chapter 2",
    content: "Test chapter 2 content",
    createdAt: new Date("2024-01-02T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  },
];
