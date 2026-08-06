/**
 * Manga test fixtures
 */

export const mockManga = {
  id: "test-manga-id",
  title: "Test Manga",
  slug: "test-manga",
  description: "Test manga description",
  author: "Test Author",
  artist: "Test Artist",
  coverImage: null,
  status: "ONGOING",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

export const mockMangaList = [
  mockManga,
  {
    id: "manga-2",
    title: "Another Manga",
    slug: "another-manga",
    description: "Another manga description",
    author: "Another Author",
    artist: "Another Artist",
    coverImage: null,
    status: "COMPLETED",
    createdAt: new Date("2024-01-02T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  },
];
