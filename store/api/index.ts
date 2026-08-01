/**
 * API Export
 * Centralized export for all RTK Query APIs
 */

export { baseApi } from "./baseApi";
export { authApi } from "./authApi";
export { mangaApi } from "./mangaApi";
export { chapterApi } from "./chapterApi";
export { userApi } from "./userApi";
export { genreApi } from "./genreApi";
export { bookmarkApi } from "./bookmarkApi";
export { historyApi } from "./historyApi";
export { commentApi } from "./commentApi";
export { ratingApi } from "./ratingApi";
export { subscriptionApi } from "./subscriptionApi";

// Re-export types with unique names to avoid conflicts
export type { User as AuthUser, LoginRequest, RegisterRequest } from "./authApi";
export type { Manga, MangaListResponse, CreateMangaRequest } from "./mangaApi";
export type { Chapter, CreateChapterRequest } from "./chapterApi";
export type { User as UserProfile, UpdateUserRequest, ChangePasswordRequest } from "./userApi";
export type { Genre, GenreListResponse } from "./genreApi";
export type { Bookmark, BookmarkListResponse } from "./bookmarkApi";
export type { History, HistoryListResponse } from "./historyApi";
export type { Comment, CommentListResponse } from "./commentApi";
export type { Rating } from "./ratingApi";
export type { Subscription } from "./subscriptionApi";
