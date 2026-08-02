/**
 * API Export
 * Centralized export for all RTK Query APIs
 */

export { baseApi } from "./baseApi";
export { authApi, useLoginMutation, useRegisterMutation, useLogoutMutation, useMeQuery } from "./authApi";
export { mangaApi, useGetMangaListQuery, useGetMangaByIdQuery, useCreateMangaMutation, useUpdateMangaMutation, useDeleteMangaMutation, useGetMangaChaptersQuery, useGetMangaRatingsQuery, useGetMangaSuggestionsQuery } from "./mangaApi";
export { chapterApi, useGetChapterByIdQuery, useGetChaptersBySeriesIdQuery, useCreateChapterMutation, useUpdateChapterMutation, useDeleteChapterMutation, useGetChapterCommentsQuery, useUnlockChapterMutation } from "./chapterApi";
export { userApi, useGetUserByIdQuery, useGetUserStatisticsQuery, useGetFavoriteGenresQuery, useUpdateUserMutation, useUploadAvatarMutation, useDeleteUserMutation, useChangePasswordMutation } from "./userApi";
export { genreApi, useGetGenresQuery, useGetGenreByIdQuery, useCreateGenreMutation, useUpdateGenreMutation, useDeleteGenreMutation } from "./genreApi";
export { bookmarkApi, useGetBookmarksQuery, useAddBookmarkMutation, useToggleBookmarkMutation, useDeleteBookmarkMutation } from "./bookmarkApi";
export { historyApi, useGetHistoryQuery, useSaveHistoryMutation, useClearHistoryMutation, useDeleteHistoryEntryMutation } from "./historyApi";
export { commentApi, useGetCommentsByChapterIdQuery, useGetCommentByIdQuery, useAddCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from "./commentApi";
export { ratingApi, useGetRatingsBySeriesIdQuery, useGetRatingSummaryQuery, useAddRatingMutation, useUpdateRatingMutation, useDeleteRatingMutation } from "./ratingApi";
export { subscriptionApi, useGetSubscriptionsQuery, useCreateSubscriptionMutation, useCancelSubscriptionMutation } from "./subscriptionApi";

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
