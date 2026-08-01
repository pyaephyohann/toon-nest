/**
 * RTK Query Cache Tag Types
 * Defines all cache tags for automatic invalidation
 */

export const tagTypes = {
  // Auth
  AUTH: "Auth",
  USER: "User",

  // Manga/Series
  MANGA: "Manga",
  MANGA_LIST: "MangaList",
  MANGA_FEATURED: "MangaFeatured",
  MANGA_NEW: "MangaNew",
  MANGA_TRENDING: "MangaTrending",

  // Chapters
  CHAPTER: "Chapter",
  CHAPTER_LIST: "ChapterList",
  CHAPTER_LATEST: "ChapterLatest",

  // Genres
  GENRE: "Genre",
  GENRE_LIST: "GenreList",

  // User Content
  BOOKMARK: "Bookmark",
  BOOKMARK_LIST: "BookmarkList",
  HISTORY: "History",
  HISTORY_LIST: "HistoryList",
  COMMENT: "Comment",
  RATING: "Rating",

  // Premium
  SUBSCRIPTION: "Subscription",
  SUBSCRIPTION_LIST: "SubscriptionList",
  UNLOCK: "Unlock",
} as const;

export type TagTypes = typeof tagTypes[keyof typeof tagTypes];
